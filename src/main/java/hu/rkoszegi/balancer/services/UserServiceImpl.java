package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.repositories.UserRepository;
import hu.rkoszegi.balancer.web.dto.UserDTO;
import hu.rkoszegi.balancer.web.exception.UserNameAlreadyExistsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;

    public UserServiceImpl(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    public User createNewUser(UserDTO accountDto) throws UserNameAlreadyExistsException {
        if (usernameExists(accountDto.getUsername())) {
            throw new UserNameAlreadyExistsException("Username already exists");
        }
        User user = new User(accountDto.getUsername(), passwordEncoder.encode(accountDto.getPassword()), UserRole.ROLE_USER);
        return userRepository.save(user);
    }

    private boolean usernameExists(String userName) {
        User user = userRepository.findUserByUsername(userName);
        return user!= null;
    }

    @Override
    public User getLoggedInUser() {
        String userName = getLoggedInUserName();
        return userRepository.findUserByUsername(userName);
    }

    private String getLoggedInUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
