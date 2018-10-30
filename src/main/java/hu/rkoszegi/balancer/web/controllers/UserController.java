package hu.rkoszegi.balancer.web.controllers;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.services.UserService;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import hu.rkoszegi.balancer.web.exception.UserNameAlreadyExistsException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<Object> registerUserAccount(@RequestBody @Valid UserDTO accountDto) {
        User registered;
        try {
            registered = userService.createNewUser(accountDto);
            return ResponseEntity.ok(registered.getUsername());
        } catch (UserNameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Message: " + e.getMessage());
        }
    }
}
