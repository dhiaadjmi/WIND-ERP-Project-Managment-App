package winderp.agileprojectmanagment.task;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import winderp.agileprojectmanagment.backlog.BacklogDto;
import winderp.agileprojectmanagment.comment.CommentDto;
import winderp.agileprojectmanagment.comment.ReturnedCommentDto;
import winderp.agileprojectmanagment.sprint.ReturnedSprintDto;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.sprint.SprintDto;

import java.util.Date;
import java.util.List;

public record TaskDto(
        Long id,
        String name,
        String description,
        TaskState state,
        Date startDate,
        Integer estimation,
        String priority,
        Integer userId,
        Boolean isDeleted,
         List<String> imageUrls,

                @JsonManagedReference
        @JsonBackReference
        List<ReturnedSprintDto> sprints,

        List<ReturnedCommentDto> comments

) {
}