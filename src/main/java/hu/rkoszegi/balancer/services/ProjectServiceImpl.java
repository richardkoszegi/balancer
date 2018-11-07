package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import hu.rkoszegi.balancer.web.mapper.ProjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.server.MethodNotAllowedException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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
    public Iterable<ProjectDTO> listAllProjects() {
        log.debug("listAllProjects called");
        List<ProjectDTO> result = new ArrayList<>();
        User loggedInUser = userService.getLoggedInUser();
        Iterable<Project> ownedProjects = projectRepository.findAllByOwner(loggedInUser).collectList().block();
        ownedProjects.forEach(project -> result.add(projectMapper.toDto(project)));
        Iterable<Project> memberProjects = projectRepository.findAllByMembersContaining(loggedInUser).collectList().block();
        memberProjects.forEach(project -> result.add(projectMapper.toDto(project)));
        return result;
    }

    @Override
    public Project getProjectById(String id) {
        log.debug("getProjectById called");
        Optional<Project> project = projectRepository.findById(id).blockOptional();
        return project.orElse(null);
    }

    @Override
    public ProjectDTO findProjectById(String id) {
        log.debug("findProjectById called");
        Project project = getProjectById(id);
        return projectMapper.toDto(project);
    }

    @Override
    public ProjectDTO createProject(Project project) {
        log.debug("createProject called");
        project.setOwner(userService.getLoggedInUser());
        projectRepository.save(project).block();
        return projectMapper.toDto(project);
    }

    @Override
    public void updateProject(ProjectDTO dto) {
        log.debug("updateProject called");
        if(!dto.getOwnerName().equals(userService.getLoggedInUser().getUsername())) {
            throw new MethodNotAllowedException("update project for this user", null);
        }
        Project storedProject = getProjectById(dto.getId());
        storedProject.setName(dto.getName());
        storedProject.setDeadline(dto.getDeadline());
        storedProject.setDescription(dto.getDescription());
        projectRepository.save(storedProject).block();
    }

    @Override
    public void saveProject(Project project) {
        log.debug("saveProject called");
        projectRepository.save(project).block();
    }

    @Override
    public void deleteProject(String id) {
        log.debug("deleteProject called");
        Project project = getProjectById(id);
        if(!project.getOwner().getUsername().equals(userService.getLoggedInUser().getUsername())) {
            throw new MethodNotAllowedException("update project members for this user", null);
        }
        project.getTasks().forEach(task -> taskService.deleteTask(task.getId()));
        projectRepository.deleteById(id).block();
    }

    @Override
    public void updateProjectMembers(String id, Iterable<String> memberNames) {
        log.debug("updateProjectMembers called");
        Project project = getProjectById(id);
        if(!project.getOwner().getUsername().equals(userService.getLoggedInUser().getUsername())) {
            throw new MethodNotAllowedException("update project members for this user", null);
        }
        List<User> newMemberList = new ArrayList<>();
        for (String username: memberNames) {
            User user = userService.getUserByUsername(username);
            if(user != null) {
                newMemberList.add(user);
            } else {
                throw new BadRequestException("User '" + username + "' does not exists");
            }
        }
        project.setMembers(newMemberList);
        projectRepository.save(project).block();
    }
}
