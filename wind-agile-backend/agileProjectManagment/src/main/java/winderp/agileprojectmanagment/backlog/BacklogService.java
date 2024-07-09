package winderp.agileprojectmanagment.backlog;


import jakarta.ws.rs.NotFoundException;
import org.springframework.stereotype.Service;
import winderp.agileprojectmanagment.project.ProjectRepository;
import winderp.agileprojectmanagment.project.Project;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.sprint.SprintDto;
import winderp.agileprojectmanagment.sprint.SprintRepository;
import winderp.agileprojectmanagment.sprint.SprintService;
import winderp.agileprojectmanagment.task.TaskDto;
import winderp.agileprojectmanagment.task.TaskMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class BacklogService implements BacklogServiceInterface {
    private final BacklogRepository backlogRepository;
    private final BacklogMapper backlogMapper;

    private final ProjectRepository projectRepository;
    private final SprintService sprintService;
    private final SprintRepository sprintRepository;


    public BacklogService(BacklogRepository backlogRepository, BacklogMapper backlogMapper,ProjectRepository projectRepository,
                          SprintService sprintService,SprintRepository sprintRepository) {
        this.backlogRepository = backlogRepository;
        this.backlogMapper = backlogMapper;
        this.projectRepository=projectRepository;
        this.sprintService=sprintService;
        this.sprintRepository=sprintRepository;

    }
/**
  @Override
    public BacklogDto saveBacklog(BacklogDto backlogDto, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID : " + projectId));

        Backlog backlog = backlogMapper.dtoToModel(backlogDto);
        backlog.setProject(project);

        Backlog savedBacklog = backlogRepository.save(backlog);
        return backlogMapper.modelToDto(savedBacklog);
    }
*/
@Override
public BacklogDto saveBacklog(BacklogDto backlogDto, Long projectId) {
    Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID : " + projectId));

    Backlog backlog = backlogMapper.dtoToModel(backlogDto);
    backlog.setProject(project);
    backlog.setIsDeleted(false);

    Backlog savedBacklog = backlogRepository.save(backlog);

    Sprint defaultSprint = createDefaultSprintForBacklog(savedBacklog.getId());
    Long defaultSprintId = defaultSprint.getId();

    return backlogMapper.modelToDto(savedBacklog);
}


    private Sprint createDefaultSprintForBacklog(Long backlogId) {
        Backlog backlog = backlogRepository.findById(backlogId)
                .orElseThrow(() -> new RuntimeException("Backlog non trouvé avec l'ID : " + backlogId));

        Sprint sprint = new Sprint();
        sprint.setName(" Sprint par défaut");

        //sprint.setObjectif("Le Sprint par défaut");

        sprint.setDefaultSprint(true);
        sprint.setBacklog(backlog);

        Sprint savedSprint = sprintRepository.save(sprint);
        return savedSprint;

    }


    @Override
    public List<BacklogDto> findAllBacklogs() {
        List<Backlog> backlogs = backlogRepository.findByIsDeletedFalse();
        return backlogs.stream()
                .map(backlogMapper::modelToDto)
                .collect(Collectors.toList());
    }


    @Override
    public BacklogDto findBacklogById(Long id) {
        return backlogRepository.findById(id)
                .filter(backlog -> !backlog.getIsDeleted())
                .map(backlogMapper::modelToDto)
                .orElse(null);
    }


    @Override
    public void deleteBacklog(Long id) {
        backlogRepository.deleteById(id);
    }

    @Override
    public BacklogDto updateBacklog(Long id, BacklogDto updatedBacklogDto) {
        Optional<Backlog> optionalBacklog = backlogRepository.findById(id);
        if (optionalBacklog.isPresent()) {
            Backlog existingBacklog = optionalBacklog.get();

            backlogMapper.updateBacklogFromDto(updatedBacklogDto, existingBacklog);
            existingBacklog.setId(id);

            Backlog updatedBacklog = backlogRepository.save(existingBacklog);

            return backlogMapper.modelToDto(updatedBacklog);
        } else {
            throw new RuntimeException("Backlog non trouvé avec l'ID : " + id);
        }
    }

    @Override
    public void softDeleteBacklog(Long id) {
        Optional<Backlog> optionalBacklog = backlogRepository.findById(id);
        if (optionalBacklog.isPresent()) {
            Backlog backlog = optionalBacklog.get();
            backlog.setIsDeleted(true);
            backlogRepository.save(backlog);
        } else {
            throw new NotFoundException("Backlog non trouvé avec l'ID : " + id);
        }
    }

    @Override
    public void recoverBacklog(Long id) {
        Optional<Backlog> optionalBacklog = backlogRepository.findById(id);
        if (optionalBacklog.isPresent()) {
            Backlog backlog = optionalBacklog.get();
            backlog.setIsDeleted(false);
            backlogRepository.save(backlog);
        } else {
            throw new NotFoundException("Backlog non trouvé avec l'ID : " + id);
        }
    }

}
