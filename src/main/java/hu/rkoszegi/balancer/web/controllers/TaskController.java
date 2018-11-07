package hu.rkoszegi.balancer.web.controllers;

import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.services.TaskService;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;


    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @GetMapping(value = "/project/{projectId}/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Task> listAllProjectTasks(@PathVariable String projectId){
        return taskService.listProjectTasks(projectId);
    }

    @GetMapping(value = "/task/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Task> getTask(@PathVariable String id){
        return taskService.getTaskById(id);
    }

    @GetMapping(value = "/task", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Task> getTasks(){
        return taskService.findAllTask();
    }

    @PostMapping(value = "/project/{projectId}/tasks", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<TaskDTO> addTaskToProject(@PathVariable String projectId, @RequestBody TaskDTO task){
        return taskService.createTask(projectId, task);
    }

    @PutMapping(value = "/task", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> updateTask(@RequestBody TaskDTO task){
        return taskService.updateTask(task);
    }

    @PutMapping(value = "/task/batch", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> updateTask(@RequestBody List<TaskDTO> tasks){
        tasks.forEach(taskDTO -> taskService.updateTask(taskDTO).block());
        return Mono.empty();
    }

    @PutMapping(value = "/task/{id}/complete")
    public Mono<Date> completeTask(@PathVariable String id){
        return taskService.completeTask(id);
    }

    @DeleteMapping(value="/task/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Void> deleteTask(@PathVariable String id){
        return taskService.deleteTask(id);
    }

    @GetMapping(value = "/task/date/{year}/{month}/{day}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<TaskDTO> getTasksForDate(@PathVariable("year") int year, @PathVariable("month") int month, @PathVariable("day") int day){
        LocalDate localDate = LocalDate.of(year, month, day);
        return taskService.findTasksForDate(localDate);
    }
}
