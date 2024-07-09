package winderp.authentication.team;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import winderp.authentication.feign.ProjectDto;
import winderp.authentication.user.UserDtoForTeam;

import java.util.List;

public record TeamDto(
        Long id,
        String name,
        Integer companyIdentifier,
        Boolean isDeleted ,
                @JsonBackReference
       @JsonManagedReference
        List<UserDtoForTeam> users,

        List<ProjectDto> projects


) {



}
