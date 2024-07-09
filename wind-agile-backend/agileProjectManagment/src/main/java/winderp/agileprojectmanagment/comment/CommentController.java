package winderp.agileprojectmanagment.comment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/comments")
@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/create")
    public ResponseEntity<CommentDto> saveComment(
            @RequestBody CommentDto commentDto,
            @RequestParam Long taskId,
            @RequestParam Integer userId) {
        CommentDto savedCommentDto = commentService.saveComment(commentDto, taskId,userId);
        return new ResponseEntity<>(savedCommentDto, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<CommentDto>> findAllComments() {
        List<CommentDto> comments = commentService.findAllComments();
        return ResponseEntity.status(HttpStatus.OK).body(comments);
    }
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentDto>> getCommentsByTask(@PathVariable Long taskId) {
        List<CommentDto> comments = commentService.getCommentsByTask(taskId);
        return ResponseEntity.status(HttpStatus.OK).body(comments);
    }

    @GetMapping("/{comment-id}")
    public ResponseEntity<CommentDto> findCommentById(
            @PathVariable("comment-id") Long id
    ) {
        CommentDto comment = commentService.findCommentById(id);
        return comment != null ?
                ResponseEntity.status(HttpStatus.OK).body(comment) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{comment-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteComment(
            @PathVariable("comment-id") Long id
    ) {
        commentService.deleteComment(id);
    }

    @PutMapping("/{comment-id}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable("comment-id") Long id,
            @RequestBody CommentDto updatedCommentDto
    ) {
        CommentDto updatedComment = commentService.updateComment(id, updatedCommentDto);
        return updatedComment != null ?
                ResponseEntity.status(HttpStatus.OK).body(updatedComment) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
