package hu.rkoszegi.balancer.web.mapper;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public abstract class ProjectMapper {

    @Mappings({
            @Mapping(target = "ownerName", source = "owner.username"),
            @Mapping(target = "memberNames", ignore = true)
    })
    public abstract ProjectDTO toDto(Project project);

    @AfterMapping
    void afterMapping(Project project, @MappingTarget ProjectDTO projectDTO) {
        project.getMembers().forEach(user -> projectDTO.getMemberNames().add(user.getUsername()));
    }
}
