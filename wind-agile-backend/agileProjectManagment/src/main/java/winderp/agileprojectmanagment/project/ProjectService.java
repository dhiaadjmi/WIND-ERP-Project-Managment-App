package winderp.agileprojectmanagment.project;


import jakarta.ws.rs.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import winderp.agileprojectmanagment.feign.AuthenticationFeignClient;
import winderp.agileprojectmanagment.feign.TeamDto;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService implements ProjectServiceInterface {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final AuthenticationFeignClient authenticationFeignClient;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper,AuthenticationFeignClient authenticationFeignClient) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.authenticationFeignClient=authenticationFeignClient;
    }
/**
    @Override
    public ProjectDto saveProject(ProjectDto projectDto, Long teamId) {
        TeamDto teamDto = authenticationFeignClient.getTeamById(teamId);

        if (teamDto != null) {
            Project project = projectMapper.dtoToModel(projectDto);
            project.setTeamId(teamDto.getId());
            Project savedProject = projectRepository.save(project);
            return projectMapper.modelToDto(savedProject);
        } else {
            throw new NotFoundException("Team not found");
        }
    }
*/
@Override
public ProjectDto saveProject(ProjectDto projectDto, Long teamId, Integer companyIdentifier) {
    TeamDto teamDto = authenticationFeignClient.getTeamById(teamId);

    if (teamDto != null) {
        Project project = projectMapper.dtoToModel(projectDto);
        project.setTeamId(teamDto.getId());
        project.setCompanyIdentifier(companyIdentifier);
        project.setIsDeleted(false);
        Project savedProject = projectRepository.save(project);
        return projectMapper.modelToDto(savedProject);
    } else {
        throw new NotFoundException("Team not found");
    }
}
    @Override
    public List<ProjectDto> findAllProjects(Integer companyIdentifier) {
        return projectRepository.findByCompanyIdentifierAndIsDeletedFalse(companyIdentifier)
                .stream()
                .map(projectMapper::modelToDto)
                .collect(Collectors.toList());
    }


/**
    @Override
    public List<ProjectDto> findAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(projectMapper::modelToDto)
                .collect(Collectors.toList());
    }
*/

    @Override
    public ProjectDto findProjectById(Long id) {
        return projectRepository.findById(id)
                .map(projectMapper::modelToDto)
                .orElse(null);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
/**
    @Override
    public ProjectDto updateProject(Long id, ProjectDto updatedProjectDto) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project existingProject = optionalProject.get();

            projectMapper.updateProjectFromDto(updatedProjectDto, existingProject);

            existingProject.setId(id);

            Project updatedProject = projectRepository.save(existingProject);

            return projectMapper.modelToDto(updatedProject);
        } else {
            throw new NotFoundException("Projet non trouvé avec l'ID : " + id);
        }
    }
*/
     @Override
    public ProjectDto updateProject(Long id, ProjectDto updatedProjectDto, Long teamId) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project existingProject = optionalProject.get();

            existingProject.setNom(updatedProjectDto.nom());
            existingProject.setDescription(updatedProjectDto.description());
            existingProject.setState(updatedProjectDto.state());
            existingProject.setStartDate(updatedProjectDto.startDate());
            existingProject.setEndDate(updatedProjectDto.endDate());

            Integer existingCompanyIdentifier = existingProject.getCompanyIdentifier();

            TeamDto teamDto = authenticationFeignClient.getTeamById(teamId);
            if (teamDto != null) {
                existingProject.setTeamId(teamDto.getId());
            } else {
                throw new NotFoundException("Équipe non trouvée avec l'ID : " + teamId);
            }

            existingProject.setCompanyIdentifier(existingCompanyIdentifier);

            Project updatedProject = projectRepository.save(existingProject);

            return projectMapper.modelToDto(updatedProject);
        } else {
            throw new NotFoundException("Projet non trouvé avec l'ID : " + id);
        }
    }



    public ProjectDto associateProjectWithTeam(Long projectId, Long teamId) {
        TeamDto teamDto = authenticationFeignClient.getTeamById(teamId);

        if (teamDto != null) {
            Project existingProject = projectRepository.findById(projectId)
                    .orElseThrow(() -> new NotFoundException("Project not found"));

            existingProject.setTeamId(teamDto.getId());

            Project updatedProject = projectRepository.save(existingProject);

            return projectMapper.modelToDto(updatedProject);
        } else {
            throw new NotFoundException("Team not found");
        }
    }
/**
@Override
    public List<ProjectDto> getProjectsByTeamId(Long teamId) {
        List<Project> projects = projectRepository.findByTeamId(teamId);
        return projects.stream()
                .map(projectMapper::modelToDto)
                .collect(Collectors.toList());
    }
*/
        @Override
        public ProjectDto getProjectByTeamId(Long teamId) {
            List<Project> projects = projectRepository.findByTeamIdAndIsDeletedFalse(teamId);
            if (projects.isEmpty()) {
                throw new NotFoundException("No project found for the team");
            }
            return projectMapper.modelToDto(projects.get(0));
        }
    @Override
    public void softDeleteProject(Long id) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setIsDeleted(true);
            projectRepository.save(project);
        } else {
            throw new NotFoundException("Projet non trouvé avec l'ID : " + id);
        }
    }
    @Override
    public void recoverProject(Long id) {
        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setIsDeleted(false);
            projectRepository.save(project);
        } else {
            throw new NotFoundException("Projet non trouvé avec l'ID : " + id);
        }
    }
    @Override
    public List<ProjectDto> findAllProjectsByName(String keyword) {
        List<Project> projects = projectRepository.findAllByNomContainingAndIsDeletedFalse(keyword);
        return projects.stream()
                .map(projectMapper::modelToDto)
                .collect(Collectors.toList());
    }


}
