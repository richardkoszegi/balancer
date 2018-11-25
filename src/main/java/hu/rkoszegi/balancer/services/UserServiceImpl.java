package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.repositories.UserRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TaskService taskService;
    private final ProjectService projectService;

    public UserServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository, TaskService taskService, ProjectService projectService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @Override
    public Mono<String> createNewUser(NewUserDTO accountDto) {
        if(!accountDto.getPassword().equals(accountDto.getMatchingPassword())) {
            throw new BadRequestException("Passwords does not match!");
        }

        if (usernameExists(accountDto.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        User user = new User(accountDto.getUsername(), passwordEncoder.encode(accountDto.getPassword()), UserRole.ROLE_USER);
        return userRepository.save(user).map(User::getUsername);
    }

    @Override
    public boolean usernameExists(String userName) {
        User user = userRepository.findUserByUsername(userName).block();
        return user!= null;
    }



    @Override
    public Flux<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public Mono<Void> deleteUser(String userName) {
        Optional<User> userOptional = userRepository.findUserByUsername(userName).blockOptional();
        if(!userOptional.isPresent()) {
            throw new BadRequestException("User does not exists");
        }

        User user = userOptional.get();
        projectService.deleteUserOwnedProjects(user);
        taskService.reassignUserTasksToProjectOwner(user);
        projectService.removeUserFromMemberProjects(user);
        return userRepository.delete(user);
    }

    @Override
    public Mono<Void> chaneUserRole(String userName, UserRole newUserRole) {
        Optional<User> userOptional = userRepository.findUserByUsername(userName).blockOptional();
        if(!userOptional.isPresent()) {
            throw new BadRequestException("User does not exists");
        }

        User user = userOptional.get();
        user.setRole(newUserRole);
        return userRepository.save(user).then();
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findUserByUsername(username).block();
    }
}
