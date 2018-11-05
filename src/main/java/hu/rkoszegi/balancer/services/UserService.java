package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import hu.rkoszegi.balancer.web.exception.UserNameAlreadyExistsException;

public interface UserService {

    User createNewUser(NewUserDTO accountDto) throws UserNameAlreadyExistsException;

    boolean usernameExists(String userName);

    User getLoggedInUser();

    Iterable<User> getAllUser();

    void deleteUser(String userName);

    void chaneUserRole(String userName, UserRole newUserRole);
}
