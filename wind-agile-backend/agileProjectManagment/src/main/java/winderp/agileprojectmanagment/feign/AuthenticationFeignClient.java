package winderp.agileprojectmanagment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import winderp.agileprojectmanagment.project.ProjectDto;

import java.util.List;

@FeignClient(name = "authentication")
public interface AuthenticationFeignClient {
    @GetMapping("/teams/{team-id}")
    TeamDto getTeamById(@PathVariable("team-id") Long teamId);
  /**  @GetMapping("/users/{user-id}")
    UserDto getUserById(@PathVariable("user-id") Integer userId);
  */
}

