package winderp.agileprojectmanagment.feign;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

public record TeamDto(
        Long id,
        String name

) {
    public Long getId() {
        return id;
    }
    public String getTeamName() {
        return name;
    }

}
