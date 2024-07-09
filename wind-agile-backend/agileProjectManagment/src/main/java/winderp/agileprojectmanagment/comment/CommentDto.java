package winderp.agileprojectmanagment.comment;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import winderp.agileprojectmanagment.task.Task;

import java.util.Date;

public record CommentDto(
         Long id,
         String text,
         Date date,
         Integer userId,
         Long taskId
) {

}
