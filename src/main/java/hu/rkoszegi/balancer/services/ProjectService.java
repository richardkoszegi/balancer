package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface ProjectService {
    Flux<ProjectDTO> listAllProjects();

    Mono<ProjectDTO> findProjectById(String id);

    Mono<ProjectDTO> createProject(Project project);

    Mono<Void> updateProject(ProjectDTO dto);

    Mono<Void> deleteProject(String id);

    Mono<Void> deleteProjectWhenUserDeleted(Project project);

    void deleteUserOwnedProjects(User user);

    Mono<Void> updateProjectMembers(String id, Iterable<String> memberNames);

    void removeUserFromMemberProjects(User user);
}
