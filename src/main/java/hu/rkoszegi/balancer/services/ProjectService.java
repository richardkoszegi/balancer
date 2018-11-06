package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;


public interface ProjectService {
    Iterable<ProjectDTO> listAllProjects();

    Project getProjectById(String id);

    ProjectDTO findProjectById(String id);

    ProjectDTO createProject(Project project);

    void updateProject(ProjectDTO dto);

    void saveProject(Project project);

    void deleteProject(String id);

    void updateProjectMembers(String id, Iterable<String> memberNames);
}
