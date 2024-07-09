package winderp.agileprojectmanagment.sprint;

import jakarta.ws.rs.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/sprints")
@RestController
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }
  //  @PostMapping("/create")
  /**  public ResponseEntity<SprintDto> saveSprint(
            @RequestBody SprintDto sprintDto) {
        return new ResponseEntity<>(sprintService.saveSprint(sprintDto), HttpStatus.CREATED);
    }
            */

 @PostMapping("/create")
  public ResponseEntity<SprintDto> saveSprint(
          @RequestBody SprintDto sprintDto,
          @RequestParam Long backlogId) {
      SprintDto savedSprintDto = sprintService.saveSprint(sprintDto, backlogId);
      return new ResponseEntity<>(savedSprintDto, HttpStatus.CREATED);
  }


/**
@PostMapping("/create/{projectId}")
public ResponseEntity<SprintDto> saveSprint(
        @RequestBody SprintDto sprintDto,
        @PathVariable(name = "projectId") Long projectId) {
    return new ResponseEntity<>(sprintService.saveSprint(sprintDto, projectId), HttpStatus.CREATED);
}
*/


    @GetMapping("")
    public ResponseEntity<List<SprintDto>> findAllSprints() {
        List<SprintDto> sprints = sprintService.findAllSprints();
        return ResponseEntity.status(HttpStatus.OK).body(sprints);
    }
    @GetMapping("/byBacklog/{backlogId}")
    public ResponseEntity<List<SprintDto>> findSprintsByBacklog(@PathVariable Long backlogId) {
        List<SprintDto> sprints = sprintService.findSprintsByBacklog(backlogId);
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    @GetMapping("/{sprint-id}")
    public ResponseEntity<SprintDto> findSprintById(
            @PathVariable("sprint-id") Long id
    ) {
        SprintDto sprint = sprintService.findSprintById(id);
        return sprint != null ?
                ResponseEntity.status(HttpStatus.OK).body(sprint) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{sprint-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteSprint(
            @PathVariable("sprint-id") Long id
    ) {
        sprintService.deleteSprint(id);
    }

    @PutMapping("/{sprint-id}")
    public ResponseEntity<SprintDto> updateSprint(
            @PathVariable("sprint-id") Long id,
            @RequestBody SprintDto updatedSprintDto
    ) {
        SprintDto updatedSprint = sprintService.updateSprint(id, updatedSprintDto);

        return updatedSprint != null ?
                ResponseEntity.status(HttpStatus.OK).body(updatedSprint) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @GetMapping("/byTask/{task-id}")
    public ResponseEntity<List<SprintDto>> getSprintsByTaskId(@PathVariable("task-id") Long taskId) {
        List<SprintDto> sprints = sprintService.getSprintsByTaskId(taskId);
        return ResponseEntity.status(HttpStatus.OK).body(sprints);
    }

    @PostMapping("/{sprintId}/start")
    public ResponseEntity<SprintDto> startSprint(@PathVariable Long sprintId, @RequestParam Long backlogId) {
        SprintDto startedSprint = sprintService.startSprint(sprintId, backlogId);
        return ResponseEntity.status(HttpStatus.OK).body(startedSprint);
    }



    @PutMapping("/{sprint-id}/soft-delete")
    public ResponseEntity<Void> softDeleteSprint(
            @PathVariable("sprint-id") Long id
    ) {
        try {
            sprintService.softDeleteSprint(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{sprint-id}/recover")
    public ResponseEntity<Void> recoverSprint(
            @PathVariable("sprint-id") Long id
    ) {
        try {
            sprintService.recoverSprint(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
