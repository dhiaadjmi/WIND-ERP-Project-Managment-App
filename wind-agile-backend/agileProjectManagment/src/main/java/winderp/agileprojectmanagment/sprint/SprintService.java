package winderp.agileprojectmanagment.sprint;

import jakarta.persistence.EntityManager;
import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.backlog.BacklogRepository;
import winderp.agileprojectmanagment.project.Project;
import winderp.agileprojectmanagment.project.ProjectDto;
import winderp.agileprojectmanagment.project.ProjectRepository;
import winderp.agileprojectmanagment.task.Task;
import winderp.agileprojectmanagment.task.TaskRepository;
import winderp.agileprojectmanagment.task.TaskService;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class SprintService implements SprintServiceInterface {
    @Autowired
    private EntityManager entityManager;
    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    private final TaskRepository taskRepository;

    private final BacklogRepository backlogRepository;


    private final SprintMapper sprintMapper;



    public SprintService(SprintRepository sprintRepository,
                         ProjectRepository projectRepository,
                         BacklogRepository backlogRepository,
                         SprintMapper sprintMapper ,
                         TaskRepository taskRepository) {
        this.sprintRepository = sprintRepository;
        this.projectRepository=projectRepository;
        this.backlogRepository=backlogRepository;
        this.sprintMapper = sprintMapper;
        this.taskRepository=taskRepository;
    }



 public SprintDto saveSprint(SprintDto sprintDto, Long backlogId) {
     Backlog backlog = backlogRepository.findById(backlogId)
             .orElseThrow(() -> new RuntimeException("Backlog non trouvé avec l'ID : " + backlogId));
     Sprint sprint = sprintMapper.dtoToModel(sprintDto);
     sprint.setBacklog(backlog);
     sprint.setIsDeleted(false);

     Sprint savedSprint = sprintRepository.save(sprint);
     return sprintMapper.modelToDto(savedSprint);
 }
/**
 public Long getDefaultSprintId() {
     Optional<Sprint> defaultSprintOptional = sprintRepository.findByDefaultSprintTrue();
     return defaultSprintOptional.map(Sprint::getId)
             .orElseThrow(() -> new RuntimeException("Default sprint not found"));
 }
 */

@Override
public Long getDefaultSprintId(Long backlogId) {
    Backlog backlog = backlogRepository.findById(backlogId)
            .orElseThrow(() -> new RuntimeException("Backlog not found with ID: " + backlogId));

    Optional<Sprint> defaultSprintOptional = sprintRepository.findByBacklogAndDefaultSprintTrueAndIsDeletedFalse(backlog);
    return defaultSprintOptional.map(Sprint::getId)
            .orElseThrow(() -> new RuntimeException("Default sprint not found for backlog with ID: " + backlogId));
}

    @Override
    public List<SprintDto> findAllSprints() {
        return sprintRepository.findAll()
                .stream()
                .map(sprintMapper::modelToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<SprintDto> findSprintsByBacklog(Long backlogId) {
        Backlog backlog = backlogRepository.findById(backlogId)
                .orElseThrow(() -> new RuntimeException("Backlog not found with ID: " + backlogId));

        List<Sprint> sprints = sprintRepository.findByBacklogAndIsDeletedFalse(backlog);

        return sprints.stream()
                .map(sprintMapper::modelToDto)
                .collect(Collectors.toList());
    }





    @Override
    public SprintDto findSprintById(Long id) {
        return sprintRepository.findByIdAndIsDeletedFalse(id)
                .map(sprintMapper::modelToDto)
                .orElse(null);
    }



    public void deleteSprint(Long id) {
        Optional<Sprint> sprintOptional = sprintRepository.findById(id);
        if (sprintOptional.isPresent()) {
            Sprint sprint = sprintOptional.get();
            Backlog backlog = sprint.getBacklog();

            backlog.getSprints().remove(sprint);
            backlogRepository.save(backlog);

            sprintRepository.deleteById(id);
        } else {
            throw new RuntimeException("Sprint not found with id: " + id);
        }
    }



/**
    @Override
    public SprintDto updateSprint(Long id, SprintDto updatedSprintDto) {
        Sprint existingSprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint non trouvé avec l'ID : " + id));

        sprintMapper.updateSprintFromDto(updatedSprintDto, existingSprint);

        Sprint updatedSprint = sprintRepository.save(existingSprint);

        return sprintMapper.modelToDto(updatedSprint);
    }
*/
@Override
public SprintDto updateSprint(Long id, SprintDto updatedSprintDto) {

    Optional<Sprint> optionalSprint = sprintRepository.findById(id);
    if (optionalSprint.isPresent()) {
        Sprint existingSprint = optionalSprint.get();

        sprintMapper.updateSprintFromDto(updatedSprintDto, existingSprint);

        existingSprint.setId(id);

        Sprint updatedSprint = sprintRepository.save(existingSprint);

        return sprintMapper.modelToDto(updatedSprint);
    } else {
        throw new RuntimeException("Sprint non trouvé avec l'ID : " + id);
    }
}

    public List<SprintDto> getSprintsByTaskId(Long taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Sprint> sprints = task.getSprints();
            return sprints.stream()
                    .map(sprintMapper::modelToDto)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("Task not found with ID: " + taskId);
        }
    }



    public SprintDto startSprint(Long sprintId, Long backlogId) {
        Optional<Sprint> optionalSprint = sprintRepository.findById(sprintId);
        if (optionalSprint.isPresent()) {
            Sprint sprint = optionalSprint.get();
            sprint.setStartDate(new Date());
            sprint.setState(SprintState.IN_PROGRESS);

            Sprint updatedSprint = sprintRepository.save(sprint);

            updateOtherSprintsInBacklog(sprint, backlogId);

            return sprintMapper.modelToDto(updatedSprint);
        } else {
            throw new RuntimeException("Sprint not found with ID: " + sprintId);
        }
    }

    private void updateOtherSprintsInBacklog(Sprint sprint, Long backlogId) {
        Backlog backlog = backlogRepository.findById(backlogId)
                .orElseThrow(() -> new RuntimeException("Backlog not found with ID: " + backlogId));
        List<Sprint> otherSprints = sprintRepository.findByBacklogAndStateAndIsDeletedFalse(backlog, SprintState.IN_PROGRESS);

        for (Sprint otherSprint : otherSprints) {
            if (!otherSprint.getId().equals(sprint.getId())) {
                otherSprint.setState(SprintState.REPORTED);
                sprintRepository.save(otherSprint);
            }
        }
    }
    @Override
    public void softDeleteSprint(Long id) {
        Optional<Sprint> optionalSprint = sprintRepository.findById(id);
        if (optionalSprint.isPresent()) {
            Sprint sprint = optionalSprint.get();
            sprint.setIsDeleted(true);
            sprintRepository.save(sprint);
        } else {
            throw new NotFoundException("Sprint non trouvé avec l'ID : " + id);
        }
    }

    @Override
    public void recoverSprint(Long id) {
        Optional<Sprint> optionalSprint = sprintRepository.findById(id);
        if (optionalSprint.isPresent()) {
            Sprint sprint = optionalSprint.get();
            sprint.setIsDeleted(false);
            sprintRepository.save(sprint);
        } else {
            throw new NotFoundException("Sprint non trouvé avec l'ID : " + id);
        }
    }


}
