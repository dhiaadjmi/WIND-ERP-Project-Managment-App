package winderp.agileprojectmanagment.sprint;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.task.ReturnTaskDto;
import winderp.agileprojectmanagment.task.Task;
import winderp.agileprojectmanagment.task.TaskDto;

import java.util.Date;
import java.util.List;

public record SprintDto(
        Long id,
        String name,
        String objectif,
        Date createdDate,
        Date startDate,
        Date endDate,
        SprintState state,
        int priority,
        Boolean validate,
        Boolean defaultSprint,
        Boolean isDeleted,

        //  List<TaskDto> tasks,
        @JsonBackReference
                @JsonManagedReference
        List<ReturnTaskDto> tasks,

      //  Long projectId
        Long backlogId
       // String uid

) {

}