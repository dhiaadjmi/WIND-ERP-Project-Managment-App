package winderp.agileprojectmanagment.project;

import java.util.List;

public interface ProjectServiceInterface {
 // public ProjectDto saveProject(ProjectDto projectDto, Long teamId);
 public ProjectDto saveProject(ProjectDto projectDto, Long teamId, Integer companyIdentifier);

  //  public List<ProjectDto> findAllProjects();
  public List<ProjectDto> findAllProjects(Integer companyIdentifier);

    public ProjectDto findProjectById(Long id);

    public void deleteProject(Long id);

  //  public ProjectDto updateProject(Long id, ProjectDto updatedProjectDto);
  public ProjectDto updateProject(Long id, ProjectDto updatedProjectDto, Long teamId);
    public ProjectDto associateProjectWithTeam(Long projectId, Long teamId);

  //  public List<ProjectDto> getProjectsByTeamId(Long teamId);
  public ProjectDto getProjectByTeamId(Long teamId);
    public void softDeleteProject(Long id);
    public void recoverProject(Long id);
    public List<ProjectDto> findAllProjectsByName(String keyword);
}
