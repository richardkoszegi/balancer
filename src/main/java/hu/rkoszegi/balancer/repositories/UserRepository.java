package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, String> {

    User findUserByUsername(String userName);
}
