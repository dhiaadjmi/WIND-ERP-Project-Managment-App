package winderp.authentication.team;


import jakarta.ws.rs.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import winderp.authentication.feign.AgileProjectManagementFeignClient;
import winderp.authentication.feign.ProjectDto;
import winderp.authentication.user.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamService implements TeamServiceInterface {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMapper teamMapper;
    private final UserMapper userMapper;
    private final AgileProjectManagementFeignClient agileProjectManagementFeignClient;

    public TeamService(TeamRepository teamRepository, TeamMapper teamMapper,UserRepository userRepository,UserMapper userMapper,
                       AgileProjectManagementFeignClient agileProjectManagementFeignClient) {
        this.teamRepository = teamRepository;
        this.teamMapper = teamMapper;
        this.userRepository=userRepository;
        this.userMapper=userMapper;
        this.agileProjectManagementFeignClient=agileProjectManagementFeignClient;
    }

    @Override
    public TeamDto saveTeam(TeamDto teamDto) {
        Team team = teamMapper.dtoToModel(teamDto);

        Team savedTeam = teamRepository.save(team);
        return teamMapper.modelToDto(savedTeam);
    }

/**
 @Override
 public TeamDto createTeamWithUsers(TeamDto teamDto) {
     Team team = teamMapper.dtoToModel(teamDto);

     List<User> users = new ArrayList<>();
     for (UserDtoForTeam userDto : teamDto.users()) {
         Optional<User> userOptional = userRepository.findById(userDto.id());
         if (userOptional.isPresent()) {
             users.add(userOptional.get());
         } else {
             throw new RuntimeException("Utilisateur introuvable avec l'ID : " + userDto.id());
         }
     }

     if (!users.isEmpty()) {
         team.setUsers(users);
         Team savedTeam = teamRepository.save(team);

         for (User user : users) {
             user.getTeams().add(savedTeam);
             userRepository.save(user);
         }
         return teamMapper.modelToDto(savedTeam);
     } else {
         throw new RuntimeException("Aucun utilisateur valide n'a été trouvé pour créer l'équipe.");
     }
 }
*/
@Override
public TeamDto createTeamWithUsers(TeamDto teamDto, Integer companyIdentifier) {
    Optional<User> companyUserOptional = userRepository.findByIdAndRole(companyIdentifier, Role.COMPANY);
    if (companyUserOptional.isEmpty()) {
        throw new RuntimeException("Aucun utilisateur avec le rôle COMPANY trouvé avec l'identifiant : " + companyIdentifier);
    }

    Team team = teamMapper.dtoToModel(teamDto);
    team.setCompanyIdentifier(companyIdentifier);
    team.setIsDeleted(false);


    List<User> users = new ArrayList<>();
    for (UserDtoForTeam userDto : teamDto.users()) {
        Optional<User> userOptional = userRepository.findById(userDto.id());
        if (userOptional.isPresent()) {
            users.add(userOptional.get());
        } else {
            throw new RuntimeException("Utilisateur introuvable avec l'ID : " + userDto.id());
        }
    }

    if (!users.isEmpty()) {
        team.setUsers(users);
        Team savedTeam = teamRepository.save(team);

        for (User user : users) {
            user.getTeams().add(savedTeam);
            userRepository.save(user);
        }
        return teamMapper.modelToDto(savedTeam);
    } else {
        throw new RuntimeException("Aucun utilisateur valide n'a été trouvé pour créer l'équipe.");
    }
}



    @Override
    public List<TeamDto> findAllTeams() {
        return teamRepository.findAll().stream()
                .map(teamMapper::modelToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<TeamDto> findAllTeamsByCompany(Integer companyIdentifier) {
        Optional<User> companyUserOptional = userRepository.findByIdAndRole(companyIdentifier, Role.COMPANY);
        if (companyUserOptional.isEmpty()) {
            throw new RuntimeException("Aucun utilisateur avec le rôle COMPANY trouvé avec l'identifiant : " + companyIdentifier);
        }

        List<Team> teams = teamRepository.findAllByCompanyIdentifierAndIsDeletedFalse(companyIdentifier);
        return teams.stream()
                .map(teamMapper::modelToDto)
                .collect(Collectors.toList());
    }


    @Override
    public TeamDto findTeamById(Long id) {
        return teamRepository.findByIdAndIsDeletedFalse(id)
                .map(teamMapper::modelToDto)
                .orElse(null);
    }


    @Override
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
/**
    @Override
    public TeamDto updateTeam(Long id, TeamDto updatedTeamDto) {
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée avec l'ID : " + id));

        teamMapper.updateTeamFromDto(updatedTeamDto, existingTeam);

        Team updatedTeam = teamRepository.save(existingTeam);

        return teamMapper.modelToDto(updatedTeam);
    }*/
    @Override
    public TeamDto updateTeam(Long id, TeamDto updatedTeamDto) {
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée avec l'ID : " + id));

        existingTeam.setName(updatedTeamDto.name());

        for (UserDtoForTeam userDto : updatedTeamDto.users()) {
            Optional<User> userOptional = userRepository.findById(userDto.id());
            if (userOptional.isPresent()) {
                existingTeam.addUser(userOptional.get());
            } else {
                throw new RuntimeException("Utilisateur introuvable avec l'ID : " + userDto.id());
            }
        }
        List<User> usersToRemove = new ArrayList<>();
        for (User user : existingTeam.getUsers()) {
            if (!updatedTeamDto.users().stream().anyMatch(u -> u.id().equals(user.getId()))) {
                usersToRemove.add(user);
            }
        }
        for (User userToRemove : usersToRemove) {
            existingTeam.removeUser(userToRemove);
        }


        Team updatedTeam = teamRepository.save(existingTeam);

        return teamMapper.modelToDto(updatedTeam);
    }


    @Override
    public void addUserToTeam(TeamDto teamDto, Integer userId) {
        Team team = teamMapper.dtoToModel(teamDto);
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            Optional<Team> teamOptional = teamRepository.findById(team.getId());
            if (teamOptional.isPresent()) {
                Team existingTeam = teamOptional.get();

                if (!existingTeam.getUsers().contains(user)) {
                    existingTeam.getUsers().add(user);
                    user.getTeams().add(existingTeam);
                    teamRepository.save(existingTeam);
                    userRepository.save(user);
                }
            } else {
                System.out.println("Équipe non trouvée avec l'ID : " + team.getId());
            }
        } else {
            System.out.println("Utilisateur non trouvé avec l'ID : " + userId);
        }
    }
    public List<TeamDto> getTeamsWithProjects() {
        List<Team> teams = teamRepository.findAll();

        return teams.stream()
                .map(team -> {
                    List<ProjectDto> projects = agileProjectManagementFeignClient.getProjectsByTeamId(team.getId());
                    TeamDto teamDto = teamMapper.modelToDto(team);
                   // teamDto.setProjects(projects);
                    return teamDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void removeUserFromTeam(TeamDto teamDto, Integer userId) {
        Team team = teamRepository.findById(teamDto.id())
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée avec l'ID : " + teamDto.id()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));

        team.removeUser(user);
        teamRepository.save(team);
    }
    @Override
    public void softDeleteTeam(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (optionalTeam.isPresent()) {
            Team team = optionalTeam.get();
            team.setIsDeleted(true);
            teamRepository.save(team);
        } else {
            throw new NotFoundException("Team non trouvé avec l'ID : " + id);
        }
    }

    @Override
    public void recoverTeam(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (optionalTeam.isPresent()) {
            Team team = optionalTeam.get();
            team.setIsDeleted(false);
            teamRepository.save(team);
        } else {
            throw new NotFoundException("Team non trouvé avec l'ID : " + id);
        }
    }

}
