package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import hu.rkoszegi.balancer.web.mapper.ProjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.server.MethodNotAllowedException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;
    private TaskService taskService;
    private UserService userService;
    private ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository, TaskService taskService, UserService userService, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.taskService = taskService;
        this.userService = userService;
        this.projectMapper = projectMapper;
    }

    @Override
    public Flux<ProjectDTO> listAllProjects() {
        log.debug("listAllProjects called");
        User loggedInUser = userService.getLoggedInUser();
        Flux<Project> ownedProjects = projectRepository.findAllByOwner(loggedInUser);
        Flux<Project> memberProjects = projectRepository.findAllByMembersContaining(loggedInUser);
        return Flux.concat(ownedProjects.map(projectMapper::toDto), memberProjects.map(projectMapper::toDto));
    }

    @Override
    public Mono<ProjectDTO> findProjectById(String id) {
        log.debug("findProjectById called");
        Mono<Project> project = projectRepository.findById(id);
        return project.map(projectMapper::toDto);
    }

    @Override
    public Mono<ProjectDTO> createProject(Project project) {
        log.debug("createProject called");
        project.setOwner(userService.getLoggedInUser());
        Mono<Project> inserted = projectRepository.save(project);
        return inserted.map(projectMapper::toDto);
    }

    @Override
    public Mono<Void> updateProject(ProjectDTO dto) {
        log.debug("updateProject called");
        checkIfLoggedInUserCanModifyProject(dto.getOwnerName());
        Project storedProject = findProjectIfExists(dto.getId());
        storedProject.setName(dto.getName());
        storedProject.setDeadline(dto.getDeadline());
        storedProject.setDescription(dto.getDescription());
        return projectRepository.save(storedProject).then();
    }

    private void checkIfLoggedInUserCanModifyProject(String projectOwnerName) {
        if (!projectOwnerName.equals(userService.getLoggedInUser().getUsername())) {
            throw new MethodNotAllowedException("update project members for this user", null);
        }
    }

    private Project findProjectIfExists(String projectId) {
        Optional<Project> storedProjectOptional = projectRepository.findById(projectId).blockOptional();
        if (!storedProjectOptional.isPresent()) {
            throw new BadRequestException("Project not found");
        }
        return storedProjectOptional.get();
    }

    @Override
    public Mono<Void> deleteProject(String id) {
        log.debug("deleteProject called");
        Project project = findProjectIfExists(id);
        checkIfLoggedInUserCanModifyProject(project.getOwner().getUsername());
        project.getTasks().forEach(task -> taskService.deleteTask(task.getId()));
        return projectRepository.deleteById(id).then();
    }

    @Override
    public Mono<Void> updateProjectMembers(String id, Iterable<String> memberNames) {
        log.debug("updateProjectMembers called");
        Project project = findProjectIfExists(id);
        checkIfLoggedInUserCanModifyProject(project.getOwner().getUsername());
        List<User> newMemberList = new ArrayList<>();
        for (String username : memberNames) {
            User user = userService.getUserByUsername(username);
            if (user != null) {
                newMemberList.add(user);
            } else {
                throw new BadRequestException("User '" + username + "' does not exists");
            }
        }
        List<User> deletedUsers = project.getMembers().stream().filter(user -> !newMemberList.contains(user)).collect(Collectors.toList());
        List<Task> deletedUserTasks = project.getTasks().stream().filter(task -> deletedUsers.contains(task.getAssignedUser())).collect(Collectors.toList());
        deletedUserTasks.forEach(task -> {
            task.setAssignedUser(project.getOwner());
            taskService.saveTask(task);
        });

        project.setMembers(newMemberList);
        return projectRepository.save(project).then();
    }
}
