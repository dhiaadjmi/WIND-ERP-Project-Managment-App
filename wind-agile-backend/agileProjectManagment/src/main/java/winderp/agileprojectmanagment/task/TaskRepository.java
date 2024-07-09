package winderp.agileprojectmanagment.task;

import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import winderp.agileprojectmanagment.sprint.Sprint;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findBySprintsContains(Sprint sprint);
   // List<Task> findByUserId(Integer userId);

    List<Task> findByUserIdAndIsDeletedFalse(Integer userId);
    Optional<Task> findByIdAndIsDeletedFalse(Long id);

    @Query("SELECT t FROM Task t JOIN t.sprints s JOIN s.backlog b WHERE b.project.id = :projectId AND t.userId = :userId AND t.isDeleted = false")
    List<Task> findTasksByProjectIdAndUserId(@Param("projectId") Long projectId, @Param("userId") Integer userId);

}