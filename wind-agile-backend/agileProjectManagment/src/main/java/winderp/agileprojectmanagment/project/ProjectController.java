package winderp.agileprojectmanagment.project;


import jakarta.ws.rs.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import winderp.agileprojectmanagment.feign.AuthenticationFeignClient;
import winderp.agileprojectmanagment.feign.TeamDto;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final AuthenticationFeignClient authenticationFeignClient;

    public ProjectController(ProjectService projectService, AuthenticationFeignClient authenticationFeignClient) {
        this.projectService = projectService;
        this.authenticationFeignClient = authenticationFeignClient;
    }

/**
@PostMapping("/create")
public ResponseEntity<ProjectDto> saveProject(@RequestBody ProjectDto projectDto, @RequestParam("teamId") Long teamId) {
    try {
        ProjectDto savedProject = projectService.saveProject(projectDto, teamId);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    } catch (NotFoundException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    @GetMapping("")
    public List<ProjectDto> findAllProjects() {
        return projectService.findAllProjects();
    }
 */
@PostMapping("/create")
public ResponseEntity<ProjectDto> saveProject(@RequestBody ProjectDto projectDto, @RequestParam("teamId") Long teamId, @RequestParam("companyIdentifier") Integer companyIdentifier) {
    try {
        ProjectDto savedProject = projectService.saveProject(projectDto, teamId, companyIdentifier); // Passer companyIdentifier
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    } catch (NotFoundException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    @GetMapping("")
    public List<ProjectDto> findAllProjects(@RequestParam("companyIdentifier") Integer companyIdentifier) {
        return projectService.findAllProjects(companyIdentifier);
    }


    @GetMapping("/{project-id}")
    public ProjectDto findProjectById(
            @PathVariable("project-id") Long id
    ) {
        return projectService.findProjectById(id);
    }

    @DeleteMapping("/{project-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteProject(
            @PathVariable("project-id") Long id
    ) {
        projectService.deleteProject(id);
    }
/**
    @PutMapping("/{project-id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable("project-id") Long id,
            @RequestBody ProjectDto updatedProjectDto
    ) {
        ProjectDto updatedProject = projectService.updateProject(id, updatedProjectDto);

        if (updatedProject != null) {
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
 */
@PutMapping("/{project-id}")
public ResponseEntity<ProjectDto> updateProject(
        @PathVariable("project-id") Long id,
        @RequestBody ProjectDto updatedProjectDto,
        @RequestParam("teamId") Long teamId
) {
    try {
        ProjectDto updatedProject = projectService.updateProject(id, updatedProjectDto, teamId);
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    } catch (NotFoundException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    @PutMapping("/{project-id}/add/{team-id}")
    public ResponseEntity<ProjectDto> associateProjectWithTeam(
            @PathVariable("project-id") Long projectId,
            @PathVariable("team-id") Long teamId
    ) {
        try {
            ProjectDto updatedProject = projectService.associateProjectWithTeam(projectId, teamId);
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
  /**  @GetMapping("/team/{team-id}")
    public ResponseEntity<List<ProjectDto>> getProjectsByTeamId(@PathVariable("team-id") Long teamId) {
        List<ProjectDto> projects = projectService.getProjectsByTeamId(teamId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
  */
  @GetMapping("/team/{team-id}")
  public ResponseEntity<ProjectDto> getProjectByTeamId(@PathVariable("team-id") Long teamId) {
      ProjectDto project = projectService.getProjectByTeamId(teamId);
      return new ResponseEntity<>(project, HttpStatus.OK);
  }
    @PutMapping("/{project-id}/soft-delete")
    public ResponseEntity<Void> softDeleteProject(
            @PathVariable("project-id") Long id
    ) {
        try {
            projectService.softDeleteProject(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{project-id}/recover")
    public ResponseEntity<Void> recoverProject(
            @PathVariable("project-id") Long id
    ) {
        try {
            projectService.recoverProject(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDto>> searchProjects(@RequestParam("query") String query) {
        List<ProjectDto> projects = projectService.findAllProjectsByName(query);
        return ResponseEntity.ok(projects);
    }

}
