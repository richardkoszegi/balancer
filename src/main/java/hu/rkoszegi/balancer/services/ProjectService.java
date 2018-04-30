package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;


public interface ProjectService {
    Iterable<Project> listAllProjects();

    Project getProjectById(String id);

    void saveProject(Project project);

    void deleteProject(String id);
}
