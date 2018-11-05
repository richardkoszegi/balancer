package hu.rkoszegi.balancer.web.mapper;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO mapUserToDto(User user);

    Iterable<UserDTO> mapUsersToDtoList(Iterable<User> users);
}
