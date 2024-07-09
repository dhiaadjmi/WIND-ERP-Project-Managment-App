package winderp.agileprojectmanagment.project;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.backlog.BacklogDto;
import winderp.agileprojectmanagment.sprint.SprintDto;
import winderp.agileprojectmanagment.task.TaskDto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectDto(
        Long id,
        String nom,
        String description,
        ProjectState state,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Long teamId,
        Integer companyIdentifier,
        Boolean isDeleted,

                BacklogDto backlog
        // List<SprintDto> sprints


        ) {
}