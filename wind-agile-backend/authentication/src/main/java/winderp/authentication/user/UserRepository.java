package winderp.authentication.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository <User,Integer>{
    Optional<User> findByEmail (String email);
    Optional<User> findByEmailAndVerificationToken(String email, String verificationToken);

    List<User>  findAllByRole(Role role) ;

  //  List<User> findAllByCompanyIdentifier(Integer companyIdentifier);
    Optional<User> findByIdAndRole(Integer id, Role role);

    List<User> findAllByCompanyIdentifierAndArchivedFalse(Integer companyIdentifier);
    List<User> findAllByRoleAndArchivedFalse(Role role);
    List<User> findByRoleAndCompanyIdentifier(Role role, Integer companyIdentifier);
    List<User> findAllByFirstnameContainingOrLastnameContainingAndArchivedFalse(String firstname, String lastname);

    List<User> findAllByCompanyNameContainingAndArchivedFalse( String companyName);

    boolean existsByEmail(String email);


}
