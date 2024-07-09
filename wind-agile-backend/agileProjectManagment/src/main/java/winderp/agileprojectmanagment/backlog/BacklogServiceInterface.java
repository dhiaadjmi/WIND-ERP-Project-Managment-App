package winderp.agileprojectmanagment.backlog;

import winderp.agileprojectmanagment.task.TaskDto;

import java.util.List;

public interface BacklogServiceInterface {
    public BacklogDto saveBacklog(BacklogDto backlogDto, Long projectId);
    public List<BacklogDto> findAllBacklogs();

    public BacklogDto findBacklogById(Long id);

    public void deleteBacklog(Long id);

    public BacklogDto updateBacklog(Long id, BacklogDto updatedBacklogDto) ;
    public void softDeleteBacklog(Long id);
    public void recoverBacklog(Long id);

}