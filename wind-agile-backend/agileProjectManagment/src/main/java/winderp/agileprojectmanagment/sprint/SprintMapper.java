package winderp.agileprojectmanagment.sprint;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import winderp.agileprojectmanagment.task.Task;
import winderp.agileprojectmanagment.task.TaskDto;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SprintMapper {
    SprintMapper INSTANCE = Mappers.getMapper(SprintMapper.class);
   // @Mapping(source = "sprint.project.id", target = "projectId")
    @Mapping(source = "sprint.backlog.id", target = "backlogId")
    SprintDto modelToDto(Sprint sprint);


    Sprint dtoToModel(SprintDto sprintDto);
    @Mapping(target = "tasks", ignore = true)
    void updateSprintFromDto(SprintDto sprintDto, @MappingTarget Sprint sprint);



}
