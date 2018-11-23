package hu.rkoszegi.balancer.web.controllers;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.services.ProjectService;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<ProjectDTO> listAllProject(){
        return projectService.listAllProjects();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ProjectDTO> getProject(@PathVariable String id){
        return projectService.findProjectById(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ProjectDTO> createProject(@RequestBody Project project){
        return projectService.createProject(project);
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> updateProject(@RequestBody ProjectDTO project){
        return projectService.updateProject(project);
    }

    @PutMapping(value="/{id}/members", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> updateProjectMembers(@PathVariable String id, @RequestBody Iterable<String> memberNames){
        return projectService.updateProjectMembers(id, memberNames);

    }

    @DeleteMapping(value="/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> deleteProject(@PathVariable String id){
        return projectService.deleteProject(id);

    }

}
