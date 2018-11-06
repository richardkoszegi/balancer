package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import org.springframework.data.repository.CrudRepository;

import java.time.Instant;


public interface TaskRepository extends CrudRepository<Task, String> {

    Iterable<Task> findAllByAssignedUserAndPlannedDateBetween(User user, Instant from, Instant to);

    Iterable<Task> findAllByAssignedUser(User user);
}
