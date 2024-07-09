package winderp.agileprojectmanagment.task;

import jakarta.ws.rs.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import winderp.agileprojectmanagment.feign.AuthenticationFeignClient;
import winderp.agileprojectmanagment.feign.UserDto;

import java.util.List;

@RequestMapping("/tasks")
@RestController
public class TaskController {

    private final TaskService taskService;
    private final AuthenticationFeignClient authenticationFeignClient;

    public TaskController(TaskService taskService,AuthenticationFeignClient authenticationFeignClient) {
        this.taskService = taskService;
        this.authenticationFeignClient=authenticationFeignClient;
    }

/**
  @PostMapping("/create")
  public ResponseEntity<TaskDto> saveTask(@RequestBody TaskDto taskDto) {
      return new ResponseEntity<>(taskService.saveTask(taskDto), HttpStatus.CREATED);
  }*/


@PostMapping("/create/{backlogId}")
public ResponseEntity<TaskDto> saveTask(@PathVariable Long backlogId, @RequestBody TaskDto taskDto) {
    return new ResponseEntity<>(taskService.saveTask(taskDto, backlogId), HttpStatus.CREATED);
}
    @PostMapping("/createInSprint/{sprintId}/{backlogId}/{userId}")
    public ResponseEntity<TaskDto> saveTaskInSprint(
            @RequestBody TaskDto taskDto,
            @PathVariable Long sprintId,
            @PathVariable Long backlogId,
            @PathVariable Integer userId
    ) {

        TaskDto savedTask = taskService.saveTaskInSprint(taskDto, sprintId, backlogId, userId);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }










    /**
@PostMapping("/create")
public ResponseEntity<TaskDto> saveTask(@RequestBody TaskDto taskDto) {
    Long defaultSprintId = taskService.getDefaultSprintId();
    return new ResponseEntity<>(taskService.saveTask(taskDto, defaultSprintId), HttpStatus.CREATED);
}
*/


    @GetMapping("")
    public ResponseEntity<List<TaskDto>> findAllTasks() {
        List<TaskDto> tasks = taskService.findAllTasks();
        return ResponseEntity.status(HttpStatus.OK).body(tasks);
    }

    @GetMapping("/{task-id}")
    public ResponseEntity<TaskDto> findTaskById(@PathVariable("task-id") Long id) {
        TaskDto task = taskService.findTaskById(id);
        return task != null ?
                ResponseEntity.status(HttpStatus.OK).body(task) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{task-id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("task-id") Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/{task-id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable("task-id") Long id,
            @RequestBody TaskDto updatedTaskDto
            ) {
        TaskDto updatedTask = taskService.updateTask(id, updatedTaskDto);
        return updatedTask != null ?
                ResponseEntity.status(HttpStatus.OK).body(updatedTask) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @GetMapping("/backlogs/{backlogId}")
    public ResponseEntity<List<TaskDto>> findAllTasksByBacklogId(@PathVariable Long backlogId) {
        List<TaskDto> tasks = taskService.findAllTasksByBacklogId(backlogId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/defaultSprintTasks/{backlogId}")
    public ResponseEntity<List<TaskDto>> findTasksInDefaultSprint(@PathVariable Long backlogId) {
        List<TaskDto> tasksInDefaultSprint = taskService.findTasksInDefaultSprint(backlogId);
        return new ResponseEntity<>(tasksInDefaultSprint, HttpStatus.OK);
    }
    /**@PutMapping("/{taskId}/sprint/{newSprintId}")
    public ResponseEntity<TaskDto> updateTaskSprint(
            @PathVariable("taskId") Long taskId,
            @PathVariable("newSprintId") Long newSprintId,
            @RequestParam("backlogId") Long backlogId) {
        TaskDto updatedTask = taskService.updateTaskSprint(taskId, newSprintId, backlogId);
        return ResponseEntity.ok(updatedTask);
    }
            */
    /**
    @PutMapping("/{taskId}/{oldSprintId}/{newSprintId}")
    public ResponseEntity<TaskDto> updateTaskSprint(
            @PathVariable Long taskId,
            @PathVariable Long oldSprintId,
            @PathVariable Long newSprintId

    ) {
        TaskDto updatedTask = taskService.updateTaskSprint(taskId, oldSprintId, newSprintId );
        return ResponseEntity.ok(updatedTask);
    }
*/
    @PutMapping("/{taskId}/{oldSprintId}/{newSprintId}/{backlogId}")
    public ResponseEntity<TaskDto> updateTaskSprint(
            @PathVariable Long taskId,
            @PathVariable Long oldSprintId,
            @PathVariable Long newSprintId,
            @PathVariable Long backlogId
    ) {
        TaskDto updatedTask = taskService.updateTaskSprint(taskId, oldSprintId, newSprintId, backlogId);
        return ResponseEntity.ok(updatedTask);
    }
    @GetMapping("/by-sprint/{sprintId}")
    public ResponseEntity<List<TaskDto>> getTasksBySprintId(@PathVariable("sprintId") Long sprintId) {
        List<TaskDto> tasks = taskService.getTasksBySprintId(sprintId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByUserId(@PathVariable Integer userId) {
        List<TaskDto> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(tasks);
    }
    @PostMapping("/{taskId}/associateWithSprint/{sprintId}/{backlogId}")
    public ResponseEntity<TaskDto> associateTaskWithSprint(
            @PathVariable Long taskId,
            @PathVariable Long sprintId,
            @PathVariable Long backlogId
    ) {
        TaskDto updatedTask = taskService.associateTaskWithSprint(taskId, sprintId, backlogId);
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{task-id}/assignUser/{user-id}")
    public ResponseEntity<TaskDto> assignTaskToUser(
            @PathVariable("task-id") Long taskId,
            @PathVariable("user-id") Integer userId
    ) {
        TaskDto assignedTask = taskService.assignTaskToUser(taskId, userId);
        return ResponseEntity.ok(assignedTask);
    }
    @DeleteMapping("/{taskId}/images")
    public ResponseEntity<String> deleteTaskImage(
            @PathVariable("taskId") Long taskId,
            @RequestParam("imageName") String imageName) {
        try {
            taskService.deleteTaskImage(taskId, imageName);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/{task-id}/state")
    public ResponseEntity<TaskDto> updateTaskState(
            @PathVariable("task-id") Long id,
            @RequestBody TaskDto updatedTaskDto
    ) {
        TaskDto updatedTask = taskService.updateTaskState(id, updatedTaskDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
    }

    @PutMapping("/{task-id}/soft-delete")
    public ResponseEntity<Void> softDeleteTask(
            @PathVariable("task-id") Long id
    ) {
        try {
            taskService.softDeleteTask(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{task-id}/recover")
    public ResponseEntity<Void> recoverTask(
            @PathVariable("task-id") Long id
    ) {
        try {
            taskService.recoverTask(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/by-project-and-user/{projectId}/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByProjectIdAndUserId(@PathVariable Long projectId, @PathVariable Integer userId) {
        List<TaskDto> tasks = taskService.findTasksByProjectIdAndUserId(projectId, userId);
        return ResponseEntity.ok(tasks);
    }
}
