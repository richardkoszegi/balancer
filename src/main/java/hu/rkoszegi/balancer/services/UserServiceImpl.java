package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.UserRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.NewUserDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private ProjectRepository projectRepository;

    public UserServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository, ProjectRepository projectRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
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
    public User getLoggedInUser() {
        String userName = getLoggedInUserName();
        return userRepository.findUserByUsername(userName).block();
    }

    private String getLoggedInUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
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
        Iterable<Project> userProjects = user.getProjects();
        userProjects.forEach(project -> projectRepository.delete(project));
        return userRepository.delete(user).then();
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
