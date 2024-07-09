package winderp.agileprojectmanagment.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import winderp.agileprojectmanagment.task.Task;
import winderp.agileprojectmanagment.task.TaskRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final CommentMapper commentMapper;

    @Autowired
    public CommentService(CommentRepository commentRepository, TaskRepository taskRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.commentMapper = commentMapper;
    }

    public CommentDto saveComment(CommentDto commentDto, Long taskId,Integer userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
        Comment comment = commentMapper.dtoToModel(commentDto);
        comment.setTask(task);
        comment.setUserId(userId);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.modelToDto(savedComment);
    }

    public List<CommentDto> findAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(commentMapper::modelToDto)
                .collect(Collectors.toList());
    }
    public List<CommentDto> getCommentsByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));
        List<Comment> comments = commentRepository.findByTask(task);
        return comments.stream()
                .map(commentMapper::modelToDto)
                .collect(Collectors.toList());
    }

    public CommentDto findCommentById(Long id) {
        return commentRepository.findById(id)
                .map(commentMapper::modelToDto)
                .orElse(null);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public CommentDto updateComment(Long id, CommentDto updatedCommentDto) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isPresent()) {
            Comment existingComment = optionalComment.get();
            commentMapper.updateCommentFromDto(updatedCommentDto, existingComment);
            existingComment.setId(id);
            Comment updatedComment = commentRepository.save(existingComment);
            return commentMapper.modelToDto(updatedComment);
        } else {
            return null;
        }
    }


}
