package winderp.agileprojectmanagment.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    //List<Project> findByTeamId(Long teamId);
    List<Project> findByTeamIdAndIsDeletedFalse(Long teamId);

    //List<Project> findByCompanyIdentifier(Integer companyIdentifier);
    List<Project> findByCompanyIdentifierAndIsDeletedFalse(Integer companyIdentifier);
    List<Project> findAllByNomContainingAndIsDeletedFalse(String nom);

}