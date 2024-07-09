package winderp.agileprojectmanagment.backlog;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BacklogRepository extends JpaRepository<Backlog, Long> {
    List<Backlog> findByIsDeletedFalse();

}