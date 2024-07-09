package winderp.agileprojectmanagment.project;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import winderp.agileprojectmanagment.backlog.Backlog;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.task.Task;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "_project ")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue
    private Long id ;
    @Column(nullable = false)
    private String nom ;
    private String description;
    @Enumerated(EnumType.STRING)
    private ProjectState state;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Column(name = "team_id")
    private Long teamId;
    @Column(name = "company_identifier")
    private Integer companyIdentifier;
    private Boolean isDeleted;

    @OneToOne(mappedBy = "project")
    @JsonManagedReference
    private Backlog backlog;



}
