package hu.rkoszegi.balancer.repositories;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.User;
import org.springframework.data.repository.CrudRepository;


public interface ProjectRepository extends CrudRepository<Project, String> {

    Iterable<Project> findAllByUser(User user);
}
