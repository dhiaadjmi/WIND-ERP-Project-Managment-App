package winderp.authentication.user;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto modelToDto(User user);

    User dtoToModel(UserDto userDto);

    void updateUserFromDto(UserDto userDto, @MappingTarget User user);

    List<UserDto> modelsToDtos(List<User> users);
}
