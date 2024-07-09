package winderp.authentication.user;

public record UserDtoForTeam(  Integer id,
                               String firstname,
                               String lastname,
                               String email,

                                String profileImageUrl,

                               String job,
                               String phoneNumber,
                               Integer cin,

                               Role role

                               ) {
}
