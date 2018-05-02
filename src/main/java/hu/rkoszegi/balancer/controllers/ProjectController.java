package hu.rkoszegi.balancer.controllers;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.services.ProjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class ProjectController {

    private ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @RequestMapping(method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Project> listAllProject(){
        log.debug("listAllProject called");
        return projectService.listAllProjects();
    }

    @RequestMapping(value = "/{id}", method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Project getProject(@PathVariable String id){
        log.debug("getProject called");
        return projectService.getProjectById(id);
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createProject(@RequestBody Project project){
        projectService.saveProject(project);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateProject(@PathVariable String id, @RequestBody Project project){
        Project storedProject = projectService.getProjectById(id);
        storedProject.setName(project.getName());
        storedProject.setDeadline(project.getDeadline());
        storedProject.setDescription(project.getDescription());
        projectService.saveProject(project);
        return new ResponseEntity<>("Project updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteProject(@PathVariable String id){
        projectService.deleteProject(id);
        return new ResponseEntity<>("Project deleted successfully", HttpStatus.OK);

    }

}
