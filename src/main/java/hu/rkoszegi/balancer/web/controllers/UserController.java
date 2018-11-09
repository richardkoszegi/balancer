package hu.rkoszegi.balancer.web.controllers;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.services.UserService;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import hu.rkoszegi.balancer.web.mapper.UserMapper;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;

    public UserController(UserMapper userMapper, UserService userService) {
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @PostMapping(value = "/register")
    public Mono<String> registerUserAccount(@RequestBody @Valid NewUserDTO accountDto) {
        return userService.createNewUser(accountDto);
    }

    @GetMapping(value = "/checkUserName")
    public Mono<Boolean> checkIfUserExists(@RequestParam("username") String username) {
        return Mono.just(userService.usernameExists(username));
    }

    @GetMapping(value = "/loggedInUser")
    public Mono<UserDTO> getLoggedInUser() {
        return Mono.just(userService.getLoggedInUser()).map(userMapper::mapUserToDto);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<String>> getAllUserNames() {
        Flux<User> users = userService.getAllUser();
        return users.map(User::getUsername).collectList();
    }


    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Flux<UserDTO> getAllUser() {
        return userService.getAllUser().map(userMapper::mapUserToDto);
    }

    @DeleteMapping(value = "/{userName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Mono<Void> deleteUser(@PathVariable("userName") String userName) {
        return userService.deleteUser(userName);
    }

    @PutMapping(value = "/{userName}/makeAdmin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Mono<Void> changeUserRole(@PathVariable("userName") String userName) {
        return userService.chaneUserRole(userName, UserRole.ROLE_ADMIN);
    }
}
