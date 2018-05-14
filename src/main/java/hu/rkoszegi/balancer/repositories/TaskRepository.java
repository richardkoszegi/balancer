package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Task;
import org.springframework.data.repository.CrudRepository;

import java.time.Instant;


public interface TaskRepository extends CrudRepository<Task, String> {

    Iterable<Task> findAllByPlannedDateBetween(Instant from, Instant to);
}
