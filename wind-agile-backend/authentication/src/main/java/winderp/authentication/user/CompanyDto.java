package winderp.authentication.user;

public record CompanyDto(
        Integer id,
        String email,

        String password,
        String companyName,
        String sector,
        Integer size,
        String phoneNumber,
        Boolean archived ,

        Role role,
        Boolean validate,
        Boolean emailVerified

) {


    public String getPassword() {
        return password;
    }

}