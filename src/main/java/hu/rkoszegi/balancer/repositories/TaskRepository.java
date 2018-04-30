package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Task;
import org.springframework.data.repository.CrudRepository;


public interface TaskRepository extends CrudRepository<Task, String> {
}
