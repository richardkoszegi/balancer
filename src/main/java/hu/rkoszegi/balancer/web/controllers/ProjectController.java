package hu.rkoszegi.balancer.web.controllers;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.services.ProjectService;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class ProjectController {

    private ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @RequestMapping(method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ProjectDTO> listAllProject(){
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
        projectService.createProject(project);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateProject(@RequestBody ProjectDTO project){
        projectService.updateProject(project);
        return new ResponseEntity<>("Project updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value="/{id}/members", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateProjectMembers(@PathVariable String id, @RequestBody Iterable<String> memberNames){
        projectService.updateProjectMembers(id, memberNames);
        return new ResponseEntity<>("Project members updated successfully", HttpStatus.OK);

    }

    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteProject(@PathVariable String id){
        projectService.deleteProject(id);
        return new ResponseEntity<>("Project deleted successfully", HttpStatus.OK);

    }

}
