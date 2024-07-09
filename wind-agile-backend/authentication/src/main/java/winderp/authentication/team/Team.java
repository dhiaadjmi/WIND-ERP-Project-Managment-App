package winderp.authentication.team;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import winderp.authentication.feign.ProjectDto;
import winderp.authentication.user.User;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "_team")
@Data
@Getter
@Setter
public class Team {
    @Id
    @GeneratedValue
    private Long id ;
    private String name;
    private Integer companyIdentifier;
    private Boolean isDeleted = false;
    @ManyToMany(mappedBy = "teams")
    private List<User> users;


//@ElementCollection
    //private List<Long > users;


    public void addUser(User user) {
        if (!this.users.contains(user)) {
            this.users.add(user);
            user.getTeams().add(this);
        }
    }
    public void removeUser(User user) {
        if (this.users.contains(user)) {
            this.users.remove(user);
            user.getTeams().remove(this);
        }
    }

}
