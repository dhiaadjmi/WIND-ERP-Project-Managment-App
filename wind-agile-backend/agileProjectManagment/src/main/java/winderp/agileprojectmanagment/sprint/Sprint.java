package winderp.agileprojectmanagment.sprint;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.project.Project;
import winderp.agileprojectmanagment.project.ProjectState;
import winderp.agileprojectmanagment.task.Task;

import java.rmi.server.UID;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "_sprint ")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Sprint {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String objectif;
    private Date createdDate;
    private Date startDate;
    private Date endDate;

    private SprintState state;
    private int priority;
    private Boolean validate;
    private Boolean defaultSprint;

    private Boolean isDeleted = false;



    @ManyToMany(mappedBy = "sprints")
    private List<Task> tasks;

 /**   @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;
*/
     @ManyToOne
     @JoinColumn(name = "backlog_id")
     @JsonBackReference
     private Backlog backlog;



}