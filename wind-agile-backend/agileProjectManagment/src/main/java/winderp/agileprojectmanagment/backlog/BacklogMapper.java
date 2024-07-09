package winderp.agileprojectmanagment.backlog;


import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import winderp.agileprojectmanagment.sprint.Sprint;
import winderp.agileprojectmanagment.sprint.SprintDto;
import winderp.agileprojectmanagment.sprint.SprintMapper;
import winderp.agileprojectmanagment.sprint.SprintRepository;
import winderp.agileprojectmanagment.task.Task;
import winderp.agileprojectmanagment.task.TaskDto;
import winderp.agileprojectmanagment.task.TaskMapper;

import java.util.List;


@Mapper(componentModel = "spring", uses = SprintMapper.class)

public interface BacklogMapper {
    BacklogMapper INSTANCE = Mappers.getMapper(BacklogMapper.class);
    @Mapping(source = "backlog.project.id", target = "projectId")
    BacklogDto modelToDto(Backlog backlog);

    Backlog dtoToModel(BacklogDto backlogDto);


    void updateBacklogFromDto(BacklogDto backlogDto, @MappingTarget Backlog backlog);
  //  List<TaskDto> tasksToTaskDtos(List<Task> tasks);

   // List<Task> taskDtosToTasks(List<TaskDto> taskDtos);
}