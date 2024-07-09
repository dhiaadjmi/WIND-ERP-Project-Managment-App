package winderp.authentication.team;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeamMapper {
    TeamMapper INSTANCE = Mappers.getMapper(TeamMapper.class);

    TeamDto modelToDto(Team team);

    Team dtoToModel(TeamDto teamDto);

    void updateTeamFromDto(TeamDto teamDto, @MappingTarget Team team);

}

