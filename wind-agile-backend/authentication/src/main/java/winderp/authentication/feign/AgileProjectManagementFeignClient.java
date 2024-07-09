package winderp.authentication.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "agileProjectManagment")
public interface AgileProjectManagementFeignClient {
    @GetMapping("/projects/team/{team-id}")
    List<ProjectDto> getProjectsByTeamId(@PathVariable("team-id") Long teamId);
}
