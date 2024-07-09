package winderp.agileprojectmanagment.sprint;


import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SprintServiceInterface {
  //  public SprintDto saveSprint(SprintDto sprintDto, Long projectId);
//  public SprintDto saveSprint(SprintDto sprintDto);
  public SprintDto saveSprint(SprintDto sprintDto, Long backlogId);
  //public Long getDefaultSprintId();
  public Long getDefaultSprintId(Long backlogId);
    public List<SprintDto> findAllSprints();
  public List<SprintDto> findSprintsByBacklog(Long backlogId);

  public SprintDto findSprintById(Long id);

    public void deleteSprint(Long id) ;

    public SprintDto updateSprint(Long id, SprintDto updatedSprintDto);
  public List<SprintDto> getSprintsByTaskId(Long taskId);
  public void softDeleteSprint(Long id);
  public void recoverSprint(Long id);
}
