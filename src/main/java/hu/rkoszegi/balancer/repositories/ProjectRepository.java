package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Project;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

/**
 * Created by: rkoszegi
 * Date: 2018.04.27.
 */
public interface ProjectRepository extends ReactiveMongoRepository<Project, String> {
}
