package hu.rkoszegi.balancer.web.mapper;

import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "assignedUser", source = "assignedUser.username")
    TaskDTO toDto(Task task);
}
