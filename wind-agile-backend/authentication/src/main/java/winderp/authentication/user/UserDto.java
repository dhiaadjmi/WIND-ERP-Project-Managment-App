package winderp.authentication.user;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import winderp.authentication.team.TeamDtoForUser;

import java.util.List;

public record UserDto(
        Integer id,
        String firstname,
        String lastname,
        String email,
        String password,
        String job,
         String phoneNumber,
         Integer cin,
       Boolean archived ,

        Role role,
        Integer companyIdentifier,
         String profileImageUrl,

                @JsonBackReference
        @JsonManagedReference
        List<TeamDtoForUser> teams

) {
    public String getPassword() {
        return password;
    }



}
