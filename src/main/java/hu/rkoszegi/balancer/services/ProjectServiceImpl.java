package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public Iterable<Project> listAllProjects() {
        log.debug("listAllProjects called");
        return projectRepository.findAll();
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
        projectRepository.save(project);
    }

    @Override
    public void deleteProject(String id) {
        log.debug("deleteProject called");
        projectRepository.deleteById(id);
    }
}
