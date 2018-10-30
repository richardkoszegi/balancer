package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import hu.rkoszegi.balancer.web.exception.UserNameAlreadyExistsException;

public interface UserService {

    User createNewUser(UserDTO accountDto) throws UserNameAlreadyExistsException;
}
