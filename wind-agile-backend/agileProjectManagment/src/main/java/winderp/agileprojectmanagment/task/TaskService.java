package winderp.agileprojectmanagment.task;

import jakarta.ws.rs.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.backlog.BacklogRepository;
import winderp.agileprojectmanagment.feign.AuthenticationFeignClient;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.sprint.SprintRepository;
import winderp.agileprojectmanagment.sprint.SprintService;
import winderp.agileprojectmanagment.feign.UserDto;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService implements TaskServiceInterface {

    private final TaskRepository taskRepository;
    private final BacklogRepository backlogRepository;
    private final TaskMapper taskMapper;
    private final SprintRepository sprintRepository;

    private final SprintService sprintService;



    public TaskService(TaskRepository taskRepository,
                       TaskMapper taskMapper,
                       BacklogRepository backlogRepository,
                       SprintRepository sprintRepository,
                       SprintService sprintService) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.backlogRepository = backlogRepository;
        this.sprintRepository = sprintRepository;
        this.sprintService=sprintService;
    }

@Override
public TaskDto saveTask(TaskDto taskDto, Long backlogId) {
    Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);

    Sprint defaultSprint = sprintRepository.findById(defaultSprintId)
            .orElseThrow(() -> new RuntimeException("Default sprint not found"));

    Task task = taskMapper.dtoToModel(taskDto);

    if (task.getSprints() == null) {
        task.setSprints(new ArrayList<>());
    }
    task.setIsDeleted(false);

    task.getSprints().add(defaultSprint);

    Task savedTask = taskRepository.save(task);


    return taskMapper.modelToDto(savedTask);
}
 /**   @Override
    public TaskDto saveTaskInSprint(TaskDto taskDto, Long sprintId, Long backlogId, Integer userId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + sprintId));

        Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);
        Sprint defaultSprint = sprintRepository.findById(defaultSprintId)
                .orElseThrow(() -> new RuntimeException("Default sprint not found"));


        Task task = taskMapper.dtoToModel(taskDto);

        task.setUserId(userId);

        if (task.getSprints() == null) {
            task.setSprints(new ArrayList<>());
        }

        task.getSprints().add(sprint);
        task.getSprints().add(defaultSprint);

        Task savedTask = taskRepository.save(task);

        return taskMapper.modelToDto(savedTask);
    }

*/
 @Override
 public TaskDto saveTaskInSprint(TaskDto taskDto, Long sprintId, Long backlogId, Integer userId) {
     Sprint sprint = sprintRepository.findById(sprintId)
             .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + sprintId));

     Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);
     Sprint defaultSprint = sprintRepository.findById(defaultSprintId)
             .orElseThrow(() -> new RuntimeException("Default sprint not found"));

     Task task = taskMapper.dtoToModel(taskDto);

     task.setUserId(userId);

     if (task.getSprints() == null) {
         task.setSprints(new ArrayList<>());
     }

     if (!sprintId.equals(defaultSprintId)) {
         task.getSprints().add(sprint);
     }
     task.setIsDeleted(false);

     task.getSprints().add(defaultSprint);

     Task savedTask = taskRepository.save(task);

     return taskMapper.modelToDto(savedTask);
 }


    @Override
    public List<TaskDto> findAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::modelToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto findTaskById(Long id) {
        return taskRepository.findByIdAndIsDeletedFalse(id)
                .map(taskMapper::modelToDto)
                .orElse(null);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
@Override
public TaskDto updateTask(Long id, TaskDto updatedTaskDto) {
    Task existingTask = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));

  /**  Sprint sprint = sprintRepository.findById(sprintId)
            .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + sprintId));
*/  if (updatedTaskDto.name() != null) {
        existingTask.setName(updatedTaskDto.name());
    }

    if (updatedTaskDto.description() != null) {
        existingTask.setDescription(updatedTaskDto.description());
    }
    if (updatedTaskDto.state() != null) {
        existingTask.setState(updatedTaskDto.state());
    }
    if (updatedTaskDto.startDate() != null) {
        existingTask.setStartDate(updatedTaskDto.startDate());
    }
    if (updatedTaskDto.estimation() != 0) {
        existingTask.setEstimation(updatedTaskDto.estimation());
    }
    if (updatedTaskDto.priority() != null) {
        existingTask.setPriority(updatedTaskDto.priority());
    }

 //   existingTask.setSprint(sprint);

    Task updatedTask = taskRepository.save(existingTask);
    return taskMapper.modelToDto(updatedTask);
}

    @Override
    public List<TaskDto> findAllTasksByBacklogId(Long backlogId) {
        List<TaskDto> allTasks = new ArrayList<>();

        Backlog backlog = backlogRepository.findById(backlogId)
                .orElseThrow(() -> new RuntimeException("Backlog not found with ID: " + backlogId));

        List<Sprint> sprints = sprintRepository.findByBacklogAndIsDeletedFalse(backlog);

        for (Sprint sprint : sprints) {
            List<TaskDto> sprintTasks = sprint.getTasks().stream()
                    .map(taskMapper::modelToDto)
                    .collect(Collectors.toList());
            allTasks.addAll(sprintTasks);
        }

        return allTasks;
    }
    @Override
    public List<TaskDto> findTasksInDefaultSprint(Long backlogId) {
        Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);

        Sprint defaultSprint = sprintRepository.findById(defaultSprintId)
                .orElseThrow(() -> new RuntimeException("Default sprint not found"));

        List<Task> tasksInDefaultSprint = defaultSprint.getTasks();

        List<TaskDto> tasksDtoInDefaultSprint = tasksInDefaultSprint.stream()
                .map(taskMapper::modelToDto)
                .collect(Collectors.toList());

        return tasksDtoInDefaultSprint;
    }
/**
    @Override
    public TaskDto updateTaskSprint(Long taskId, Long newSprintId, Long backlogId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        // Récupérer le sprint par défaut
        Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);
        Sprint defaultSprint = sprintRepository.findById(defaultSprintId)
                .orElseThrow(() -> new RuntimeException("Default sprint not found"));

        // Vérifier si le task est associé au sprint par défaut
        boolean isTaskInDefaultSprint = task.getSprints().contains(defaultSprint);

        // Récupérer le nouveau sprint
        Sprint newSprint = sprintRepository.findById(newSprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + newSprintId));

        // Mettre à jour le sprint du task
        task.getSprints().clear();
        task.getSprints().add(newSprint);

        Task updatedTask = taskRepository.save(task);

        // Si le task était dans le sprint par défaut, réassocier le task au sprint par défaut
        if (isTaskInDefaultSprint) {
            defaultSprint.getTasks().add(updatedTask);
            sprintRepository.save(defaultSprint);
        }

        return taskMapper.modelToDto(updatedTask);
    }


*/
/**
@Override
public TaskDto updateTaskSprint(Long taskId, Long oldSprintId, Long newSprintId) {
    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

    Sprint oldSprint = sprintRepository.findById(oldSprintId)
            .orElseThrow(() -> new RuntimeException("Old sprint not found with ID: " + oldSprintId));

    Sprint newSprint = sprintRepository.findById(newSprintId)
            .orElseThrow(() -> new RuntimeException("New sprint not found with ID: " + newSprintId));

    if (!task.getSprints().contains(oldSprint)) {
        throw new IllegalArgumentException("The task is not associated with the old sprint");
    }

    task.getSprints().remove(oldSprint);

    task.getSprints().add(newSprint);

    Task savedTask = taskRepository.save(task);

    return taskMapper.modelToDto(savedTask);
}
*/
@Override
public TaskDto updateTaskSprint(Long taskId, Long oldSprintId, Long newSprintId, Long backlogId) {
    Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);

    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

    Sprint oldSprint = sprintRepository.findById(oldSprintId)
            .orElseThrow(() -> new RuntimeException("Old sprint not found with ID: " + oldSprintId));

    Sprint newSprint = sprintRepository.findByIdAndIsDeletedFalse(newSprintId)
            .orElseThrow(() -> new RuntimeException("New sprint not found with ID: " + newSprintId));

    if (!task.getSprints().contains(oldSprint)) {
        throw new IllegalArgumentException("The task is not associated with the old sprint");
    }

    if (oldSprintId.equals(defaultSprintId)) {
        throw new IllegalArgumentException("The default sprint cannot be used as the old sprint");
    }

    if (newSprintId.equals(defaultSprintId)) {
        throw new IllegalArgumentException("The default sprint cannot be used as the new sprint");
    }

    task.getSprints().remove(oldSprint);

    task.getSprints().add(newSprint);

    Task savedTask = taskRepository.save(task);

    return taskMapper.modelToDto(savedTask);
}




    @Override
    public List<TaskDto> getTasksBySprintId(Long sprintId) {
        Sprint sprint = sprintRepository.findByIdAndIsDeletedFalse(sprintId)
                .orElseThrow(() -> new NotFoundException("Sprint not found with ID: " + sprintId));

        List<Task> tasks = sprint.getTasks().stream()
                .filter(task -> !task.getIsDeleted())
                .collect(Collectors.toList());

        return tasks.stream()
                .map(taskMapper::modelToDto)
                .collect(Collectors.toList());
    }





    @Override
    public List<TaskDto> getTasksByUserId(Integer userId) {
        List<Task> tasks = taskRepository.findByUserIdAndIsDeletedFalse(userId);
        return tasks.stream()
                .map(taskMapper::modelToDto)
                .collect(Collectors.toList());
    }



    @Override
    public TaskDto associateTaskWithSprint(Long taskId, Long sprintId, Long backlogId) {
        Sprint sprint = sprintRepository.findByIdAndIsDeletedFalse(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + sprintId));

        Long defaultSprintId = sprintService.getDefaultSprintId(backlogId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (sprintId.equals(defaultSprintId)) {
            // Si le sprint est le sprint par défaut
            throw new IllegalArgumentException("Cannot associate task with default sprint");
        }

        if (task.getSprints().stream().anyMatch(s -> s.getId().equals(sprintId))) {
            // Si le task est déjà associé au sprint choisi
            throw new IllegalArgumentException("Task is already associated with the chosen sprint");
        }

        if (task.getSprints().stream().anyMatch(s -> !s.getId().equals(defaultSprintId))) {
            // Si le task est déjà associé à un sprint autre que le sprint par défaut
            throw new IllegalArgumentException("Task is already associated with another sprint");
        }

        sprint.getTasks().add(task);
        task.getSprints().add(sprint);

        sprintRepository.save(sprint);
        taskRepository.save(task);

        return taskMapper.modelToDto(task);
    }

    @Override
    public TaskDto assignTaskToUser(Long taskId, Integer userId) {
        Task task = taskRepository.findByIdAndIsDeletedFalse(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        task.setUserId(userId);

        Task updatedTask = taskRepository.save(task);

        return taskMapper.modelToDto(updatedTask);
    }

  /**  public void uploadTaskImages(Long taskId, List<MultipartFile> files) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                String imageUrl = saveImage(file, fileName);
                imageUrls.add(imageUrl);
            }
        }

        task.setImageUrls(imageUrls);
        taskRepository.save(task);
    }
   */
  public void uploadTaskImages(Long taskId, List<MultipartFile> files) throws IOException {
      Task task = taskRepository.findById(taskId)
              .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

      List<String> oldImageUrls = task.getImageUrls();

      List<String> newImageUrls = new ArrayList<>();

      for (MultipartFile file : files) {
          if (!file.isEmpty()) {
              String fileName = StringUtils.cleanPath(file.getOriginalFilename());

              if (!oldImageUrls.contains(fileName)) {
                  String imageUrl = saveImage(file, fileName);
                  newImageUrls.add(imageUrl);
              }
          }
      }

      newImageUrls.addAll(oldImageUrls);

      task.setImageUrls(newImageUrls);
      taskRepository.save(task);
  }


    public List<String> getTaskImageUrls(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
        return task.getImageUrls();
    }


    private String saveImage(MultipartFile imageFile, String fileName) throws IOException {
        String absolutePath = "/Users/macbook/IdeaProjects/micro-services-windErp/agileprojectmanagment/src/main/resources/images";
        Path directoryPath = Paths.get(absolutePath);

        if (!Files.exists(directoryPath)) {
            try {
                Files.createDirectories(directoryPath);
            } catch (IOException e) {
                throw new RuntimeException("Unable to create directory: " + absolutePath, e);
            }
        }

        Path filePath = directoryPath.resolve(fileName);

        try {
            Files.write(filePath, imageFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Unable to write file to path: " + filePath, e);
        }

        return fileName;
    }

    public void deleteTaskImage(Long taskId, String imageName) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        List<String> imageUrls = task.getImageUrls();

        if (imageUrls.contains(imageName)) {
            imageUrls.remove(imageName);

            task.setImageUrls(imageUrls);
            taskRepository.save(task);

            deleteImageFromDirectory(imageName);
        } else {
            throw new IllegalArgumentException("Image not found with name: " + imageName);
        }
    }

    private void deleteImageFromDirectory(String imageName) {
        String absolutePath = "/Users/macbook/IdeaProjects/micro-services-windErp/agileprojectmanagment/src/main/resources/images";
        Path directoryPath = Paths.get(absolutePath);
        Path imagePath = directoryPath.resolve(imageName);

        try {
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Unable to delete image file: " + imagePath, e);
        }
    }




    public TaskDto updateTaskState(Long id, TaskDto updatedTaskDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));


        if (updatedTaskDto.state() != null) {
            existingTask.setState(updatedTaskDto.state());
        }

        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.modelToDto(updatedTask);
    }
    @Override
    public void softDeleteTask(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setIsDeleted(true);
            taskRepository.save(task);
        } else {
            throw new NotFoundException("Tâche non trouvée avec l'ID : " + id);
        }
    }

    @Override
    public void recoverTask(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setIsDeleted(false);
            taskRepository.save(task);
        } else {
            throw new NotFoundException("Tâche non trouvée avec l'ID : " + id);
        }
    }

    @Override
    public List<TaskDto> findTasksByProjectIdAndUserId(Long projectId, Integer userId) {
        List<Task> tasks = taskRepository.findTasksByProjectIdAndUserId(projectId, userId);
        return tasks.stream()
                .map(taskMapper::modelToDto)
                .collect(Collectors.toList());
    }

}
