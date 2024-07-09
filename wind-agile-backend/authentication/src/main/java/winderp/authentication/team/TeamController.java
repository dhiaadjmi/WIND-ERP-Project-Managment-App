package winderp.authentication.team;

import jakarta.ws.rs.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import winderp.authentication.feign.AgileProjectManagementFeignClient;
import winderp.authentication.feign.ProjectDto;
import winderp.authentication.user.UserDto;

import java.util.List;
import java.util.Map;

@RequestMapping("/teams")
@RestController
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/create")
    public ResponseEntity<TeamDto> saveTeam(@RequestBody TeamDto teamDto) {
        TeamDto savedTeam = teamService.saveTeam(teamDto);
        return new ResponseEntity<>(savedTeam, HttpStatus.CREATED);
    }


    @GetMapping("")
    public ResponseEntity<List<TeamDto>> findAllTeams() {
        List<TeamDto> teams = teamService.findAllTeams();
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }
    @GetMapping("/bycompany")
    public ResponseEntity<List<TeamDto>> getTeamsByCompany(@RequestParam Integer companyIdentifier) {
        List<TeamDto> teams = teamService.findAllTeamsByCompany(companyIdentifier);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }
   @PostMapping("/createteam")
   public ResponseEntity<TeamDto> createTeamWithUsers(@RequestBody TeamDto teamDto, @RequestParam Integer companyIdentifier) {
       TeamDto createdTeam = teamService.createTeamWithUsers(teamDto, companyIdentifier);
       return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
   }


    @GetMapping("/{team-id}")
    public ResponseEntity<TeamDto> findTeamById(@PathVariable("team-id") Long id) {
        TeamDto team = teamService.findTeamById(id);
        if (team != null) {
            return new ResponseEntity<>(team, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{team-id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable("team-id") Long id) {
        teamService.deleteTeam(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{team-id}")
    public ResponseEntity<TeamDto> updateTeam(
            @PathVariable("team-id") Long id,
            @RequestBody TeamDto updatedTeamDto
    ) {
        TeamDto updatedTeam = teamService.updateTeam(id, updatedTeamDto);
        if (updatedTeam != null) {
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    /**
    @PostMapping("/{teamId}/add/{userId}")
    public ResponseEntity<String> addUserToTeam(@PathVariable Long teamId, @PathVariable Integer userId) {
        TeamDto teamDto = teamService.findTeamById(teamId);

        if (teamDto != null) {
            teamService.addUserToTeam(teamDto, userId);
            return ResponseEntity.ok("Utilisateur ajouté à l'équipe avec succès.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Équipe non trouvée avec l'ID : " + teamId);
        }
    }
     */
    @PostMapping("/{teamId}/add/{userId}")
    public ResponseEntity<Map<String, String>> addUserToTeam(@PathVariable Long teamId, @PathVariable Integer userId) {
        TeamDto teamDto = teamService.findTeamById(teamId);

        if (teamDto != null) {
            teamService.addUserToTeam(teamDto, userId);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Utilisateur ajouté à l'équipe avec succès.");
            return ResponseEntity.ok(responseBody);
        } else {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "Équipe non trouvée avec l'ID : " + teamId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
        }
    }

    @GetMapping("/withprojects")
    public ResponseEntity<List<TeamDto>> getTeamsWithProjects() {
        List<TeamDto> teamsWithProjects = teamService.getTeamsWithProjects();
        return new ResponseEntity<>(teamsWithProjects, HttpStatus.OK);
    }
    /**
    @PostMapping("/{teamId}/removeUser/{userId}")
    public ResponseEntity<String> removeUserFromTeam(@PathVariable Long teamId, @PathVariable Integer userId) {
        TeamDto teamDto = teamService.findTeamById(teamId);

        if (teamDto != null) {
            teamService.removeUserFromTeam(teamDto, userId);
            return ResponseEntity.ok("Utilisateur retiré de l'équipe avec succès.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Équipe non trouvée avec l'ID : " + teamId);
        }
    }
    */
    @PostMapping("/{teamId}/removeUser/{userId}")
    public ResponseEntity<Map<String, String>> removeUserFromTeam(@PathVariable Long teamId, @PathVariable Integer userId) {
        TeamDto teamDto = teamService.findTeamById(teamId);

        if (teamDto != null) {
            teamService.removeUserFromTeam(teamDto, userId);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Utilisateur retiré de l'équipe avec succès.");
            return ResponseEntity.ok(responseBody);
        } else {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "Équipe non trouvée avec l'ID : " + teamId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
        }
    }

    @PutMapping("/{team-id}/soft-delete")
    public ResponseEntity<Void> softDeleteTeam(@PathVariable("team-id") Long id) {
        try {
            teamService.softDeleteTeam(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{team-id}/recover")
    public ResponseEntity<Void> recoverTeam(@PathVariable("team-id") Long id) {
        try {
            teamService.recoverTeam(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
