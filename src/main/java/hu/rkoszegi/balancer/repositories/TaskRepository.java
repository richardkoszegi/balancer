package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

import java.time.Instant;


public interface TaskRepository extends ReactiveMongoRepository<Task, String> {

    Flux<Task> findAllByAssignedUserAndPlannedDateBetween(User user, Instant from, Instant to);

    Flux<Task> findAllByAssignedUser(User user);
}
