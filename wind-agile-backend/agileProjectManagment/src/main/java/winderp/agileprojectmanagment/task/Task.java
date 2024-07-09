package winderp.agileprojectmanagment.task;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.comment.Comment;
import winderp.agileprojectmanagment.sprint.Sprint;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_task")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//@JsonIgnoreProperties("sprint")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private TaskState state;
    private Date startDate;
    private Integer estimation;
    private String priority;


    @Column(name = "user_id")
    private Integer userId;
    private Boolean isDeleted = false;
    @ElementCollection
    private List<String> imageUrls;
    @ManyToMany
    @JoinTable(
            name = "task_sprint",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "sprint_id")
    )
    private List<Sprint> sprints;

    @OneToMany(mappedBy = "task")
    @JsonManagedReference
    private List<Comment> comments;

}
