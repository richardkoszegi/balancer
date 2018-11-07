package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;


public interface ProjectRepository extends ReactiveMongoRepository<Project, String> {

    Flux<Project> findAllByOwner(User user);

    Flux<Project> findAllByMembersContaining(User user);
}
