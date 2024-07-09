package winderp.authentication.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findAllByCompanyIdentifierAndIsDeletedFalse(Integer companyIdentifier);
    Optional<Team> findByIdAndIsDeletedFalse(Long id);

}