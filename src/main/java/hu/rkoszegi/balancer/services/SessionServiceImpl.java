package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SessionServiceImpl implements SessionService {

    private UserRepository userRepository;

    public SessionServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
