package winderp.authentication.team;

import winderp.authentication.user.UserDto;

import java.util.List;

public interface TeamServiceInterface {
   TeamDto saveTeam(TeamDto teamDto);
 public TeamDto createTeamWithUsers(TeamDto teamDto, Integer companyIdentifier);
   // public TeamDto createTeamWithUsers(TeamDto teamDto);

    List<TeamDto> findAllTeams();
   public List<TeamDto> findAllTeamsByCompany(Integer companyIdentifier);

   public TeamDto findTeamById(Long id);
    void deleteTeam(Long id);

    public TeamDto updateTeam(Long id, TeamDto updatedTeamDto) ;
    public void addUserToTeam(TeamDto teamDto, Integer userId);
    public List<TeamDto> getTeamsWithProjects();
    public void removeUserFromTeam(TeamDto teamDto, Integer userId);
    public void softDeleteTeam(Long id);
    public void recoverTeam(Long id);


}