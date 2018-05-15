package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Task;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.repository.CrudRepository;
import reactor.core.publisher.Flux;

import java.time.Instant;


public interface TaskRepository extends ReactiveMongoRepository<Task, String> {

    Flux<Task> findAllByPlannedDateBetween(Instant from, Instant to);
}
