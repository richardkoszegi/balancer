package hu.rkoszegi.balancer.bootstrap;

import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.model.UserRole;
import hu.rkoszegi.balancer.repositories.UserRepository;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserBootstrap implements ApplicationListener<ContextRefreshedEvent> {

    private static final String FIRST_ADMIN_USER_NAME = "FirstAdminUser";

    private UserRepository userRepository;

    public UserBootstrap(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        initFirstAdmin();
    }

    private void initFirstAdmin() {
        Optional<User> optionalUser = userRepository.findUserByUsername(FIRST_ADMIN_USER_NAME).blockOptional();
        if(!optionalUser.isPresent()) {
            User user = new User();
            user.setUsername(FIRST_ADMIN_USER_NAME);
            user.setPassword("$2a$11$h5mzTndV8pUw9xbvwMyigOpVEUpV5iK66gz/rquD773P6CHSIgRxW");
            user.setRole(UserRole.ROLE_ADMIN);
            userRepository.save(user).block();
        }
    }
}
