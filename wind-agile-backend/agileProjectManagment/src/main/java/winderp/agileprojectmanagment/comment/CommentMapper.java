package winderp.agileprojectmanagment.comment;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "comment.task.id", target = "taskId")
    CommentDto modelToDto(Comment comment);

    Comment dtoToModel(CommentDto commentDto);

    void updateCommentFromDto(CommentDto commentDto, @MappingTarget Comment comment);
}
