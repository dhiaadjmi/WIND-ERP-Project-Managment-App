package winderp.agileprojectmanagment.backlog;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import winderp.agileprojectmanagment.project.ProjectDto;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.sprint.SprintDto;
import winderp.agileprojectmanagment.task.TaskDto;

import java.util.List;

public record BacklogDto(
        Long id ,

        String name,
        String description,

        Long projectId,
        Boolean isDeleted ,
        List<SprintDto> sprints

) {
}
