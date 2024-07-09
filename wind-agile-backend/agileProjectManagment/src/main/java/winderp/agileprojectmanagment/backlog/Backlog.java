package winderp.agileprojectmanagment.backlog;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import winderp.agileprojectmanagment.project.Project;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.task.Task;

import java.util.List;


@Entity
@Table(name = "_backlog")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Backlog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    @Column(nullable = false)
    private String name ;
    private String description ;

    private Boolean isDeleted = false;
    @OneToOne
    @JoinColumn(name = "project_id", unique = true)
    @JsonBackReference
    private Project project;


 @OneToMany(mappedBy = "backlog")
 @JsonManagedReference
 private List<Sprint> sprints;
}