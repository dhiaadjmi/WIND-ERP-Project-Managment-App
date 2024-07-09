package winderp.agileprojectmanagment.project;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

    ProjectDto modelToDto(Project project);

    Project dtoToModel(ProjectDto projectDto);

    void updateProjectFromDto(ProjectDto projectDto, @MappingTarget Project project);

}
