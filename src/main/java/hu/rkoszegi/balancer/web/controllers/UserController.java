package hu.rkoszegi.balancer.web.controllers;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.services.UserService;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import hu.rkoszegi.balancer.web.exception.UserNameAlreadyExistsException;
import hu.rkoszegi.balancer.web.mapper.UserMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserMapper userMapper;
    private UserService userService;

    public UserController(UserMapper userMapper, UserService userService) {
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<Object> registerUserAccount(@RequestBody @Valid NewUserDTO accountDto) {
        if(!accountDto.getPassword().equals(accountDto.getMatchingPassword())) {
            return ResponseEntity.badRequest().body("Passwords does not match!");
        }
        User registered;
        try {
            registered = userService.createNewUser(accountDto);
            return ResponseEntity.ok(registered.getUsername());
        } catch (UserNameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Message: " + e.getMessage());
        }
    }

    @RequestMapping(value = "/checkUserName", method = RequestMethod.GET)
    public ResponseEntity<Boolean> checkIfUserExists(@PathParam("username") String username) {
        return ResponseEntity.ok(userService.usernameExists(username));
    }

    @RequestMapping(value = "/loggedInUser", method = RequestMethod.GET)
    public UserDTO getLoggedInUser() {
        return userMapper.mapUserToDto(userService.getLoggedInUser());
    }


    @RequestMapping(method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Iterable<UserDTO> getAllUser() {
        return userMapper.mapUsersToDtoList(userService.getAllUser());
    }

    @RequestMapping(value = "/{userName}", method= RequestMethod.DELETE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity deleteUser(@PathVariable("userName") String userName) {
        userService.deleteUser(userName);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/{userName}/makeAdmin", method= RequestMethod.PUT)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity changeUserRole(@PathVariable("userName") String userName) {
        userService.chaneUserRole(userName, UserRole.ROLE_ADMIN);
        return ResponseEntity.ok().build();
    }
}
