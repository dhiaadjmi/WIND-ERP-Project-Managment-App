package winderp.agileprojectmanagment.comment;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.task.Task;

import java.util.Date;

@Entity
@Table(name = "_comment")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private Date date;
    private Integer userId;
    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonBackReference
    private Task task;
}
