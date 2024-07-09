package winderp.agileprojectmanagment.task;

import java.util.List;



public interface TaskServiceInterface {


  public TaskDto saveTask(TaskDto taskDto, Long backlogId);
 // public TaskDto saveTaskInSprint(TaskDto taskDto, Long sprintId, Long backlogId);
 public TaskDto saveTaskInSprint(TaskDto taskDto, Long sprintId, Long backlogId, Integer userId);
  List<TaskDto> findAllTasks();

    TaskDto findTaskById(Long id);

    void deleteTask(Long id);

    TaskDto updateTask(Long id, TaskDto updatedTaskDto);
    public List<TaskDto> findAllTasksByBacklogId(Long backlogId);
  public List<TaskDto> findTasksInDefaultSprint(Long backlogId);
  public TaskDto updateTaskSprint(Long taskId, Long oldSprintId, Long newSprintId, Long backlogId);
  // public TaskDto updateTaskSprint(Long taskId, Long oldSprintId, Long newSprintId) ;
  public List<TaskDto> getTasksBySprintId(Long sprintId);
  public List<TaskDto> getTasksByUserId(Integer userId);
    public TaskDto associateTaskWithSprint(Long taskId, Long sprintId, Long backlogId);
    public TaskDto assignTaskToUser(Long taskId, Integer userId);
    public void deleteTaskImage(Long taskId, String imageName);
    public TaskDto updateTaskState(Long id, TaskDto updatedTaskDto);

    public void softDeleteTask(Long id);
    public void recoverTask(Long id);
    public List<TaskDto> findTasksByProjectIdAndUserId(Long projectId, Integer userId) ;
}
