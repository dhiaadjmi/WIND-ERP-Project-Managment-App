package winderp.agileprojectmanagment.backlog;


import jakarta.ws.rs.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import winderp.agileprojectmanagment.task.TaskDto;
import winderp.agileprojectmanagment.task.TaskService;

import java.util.List;

@RestController
@RequestMapping("/backlogs")
public class BacklogController {

    private final BacklogService backlogService;
    private final TaskService taskService;

    public BacklogController(BacklogService backlogService,TaskService taskService) {
        this.backlogService = backlogService;
        this.taskService=taskService;
    }

    @PostMapping("/create/{projectId}")
    public ResponseEntity<BacklogDto> saveBacklog(
            @RequestBody BacklogDto backlogDto,
            @PathVariable(name = "projectId") Long projectId) {
        return new ResponseEntity<>(backlogService.saveBacklog(backlogDto, projectId), HttpStatus.CREATED);
    }

    @GetMapping("")
    public List<BacklogDto> findAllBacklogs() {
        return backlogService.findAllBacklogs();
    }

    @GetMapping("/{backlog-id}")
    public BacklogDto findBacklogById(
            @PathVariable("backlog-id") Long id
    ) {
        return backlogService.findBacklogById(id);
    }

    @DeleteMapping("/{backlog-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteBacklog(
            @PathVariable("backlog-id") Long id
    ) {
        backlogService.deleteBacklog(id);
    }

    @PutMapping("/{backlog-id}")
    public ResponseEntity<BacklogDto> updateBacklog(
            @PathVariable("backlog-id") Long id,
            @RequestBody BacklogDto updatedBacklogDto
    ) {
        BacklogDto updatedBacklog = backlogService.updateBacklog(id, updatedBacklogDto);

        if (updatedBacklog != null) {
            return new ResponseEntity<>(updatedBacklog, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{backlog-id}/soft-delete")
    public ResponseEntity<Void> softDeleteBacklog(
            @PathVariable("backlog-id") Long id
    ) {
        try {
            backlogService.softDeleteBacklog(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{backlog-id}/recover")
    public ResponseEntity<Void> recoverBacklog(
            @PathVariable("backlog-id") Long id
    ) {
        try {
            backlogService.recoverBacklog(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
