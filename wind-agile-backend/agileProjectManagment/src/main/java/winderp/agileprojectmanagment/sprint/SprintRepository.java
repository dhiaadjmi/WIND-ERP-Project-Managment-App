package winderp.agileprojectmanagment.sprint;


import org.springframework.data.jpa.repository.JpaRepository;
import winderp.agileprojectmanagment.backlog.Backlog;

import java.util.List;
import java.util.Optional;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
  //  Optional<Sprint> findByDefaultSprintTrue();
  Optional<Sprint> findByBacklogAndDefaultSprintTrueAndIsDeletedFalse(Backlog backlog);
  List<Sprint> findByBacklogAndStateAndIsDeletedFalse(Backlog backlog, SprintState state);
  List<Sprint> findByBacklogAndIsDeletedFalse(Backlog backlog);
  Optional<Sprint> findByIdAndIsDeletedFalse(Long id);


}