package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService {

    Mono<String> createNewUser(NewUserDTO accountDto);

    boolean usernameExists(String userName);

    Flux<User> getAllUser();

    Mono<Void> deleteUser(String userName);

    Mono<Void> chaneUserRole(String userName, UserRole newUserRole);

    User getUserByUsername(String username);
}
