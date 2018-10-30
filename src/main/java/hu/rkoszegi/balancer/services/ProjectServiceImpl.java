package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;
    private TaskService taskService;
    private UserService userService;

    public ProjectServiceImpl(ProjectRepository projectRepository, TaskService taskService, UserService userService) {
        this.projectRepository = projectRepository;
        this.taskService = taskService;
        this.userService = userService;
    }

    @Override
    public Iterable<Project> listAllProjects() {
        log.debug("listAllProjects called");
        return projectRepository.findAllByUser(userService.getLoggedInUser());
    }

    @Override
    public Project getProjectById(String id) {
        log.debug("getProjectById called");
        Optional<Project> project = projectRepository.findById(id);
        return project.orElse(null);
    }

    @Override
    public void saveProject(Project project) {
        log.debug("saveProject called");
        project.setUser(userService.getLoggedInUser());
        projectRepository.save(project);
    }

    @Override
    public void deleteProject(String id) {
        log.debug("deleteProject called");
        Project project = getProjectById(id);
        project.getTasks().forEach(task -> taskService.deleteTask(task.getId()));
        projectRepository.deleteById(id);
    }
}
