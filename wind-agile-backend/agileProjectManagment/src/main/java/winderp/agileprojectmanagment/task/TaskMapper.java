package winderp.agileprojectmanagment.task;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);


 //   @Mapping(source = "task.backlog.id", target = "backlogId")
  //  @Mapping(source = "task.sprint.id", target = "sprintId")
  //  @Mapping(source = "task.sprint.uid", target = "sprintUid")
    TaskDto modelToDto( Task task);

    Task dtoToModel(TaskDto taskDto);

 //   @Mapping(source = "sprintId", target = "task.sprint.id")
    void updateTaskFromDto(TaskDto taskDto, @MappingTarget Task task);
}
