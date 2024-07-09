package winderp.authentication.user;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    CompanyMapper INSTANCE = Mappers.getMapper(CompanyMapper.class);

    CompanyDto modelToDto(User user);

    User dtoToModel(CompanyDto companyDto);

    @Mapping(target = "validate", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    void updateCompanyFromDto(CompanyDto companyDto, @MappingTarget User user);

    List<CompanyDto> modelsToDtos(List<User> users);
}
