package winderp.agileprojectmanagment.comment;


import org.springframework.data.jpa.repository.JpaRepository;
import winderp.agileprojectmanagment.task.Task;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTask(Task task);

}
