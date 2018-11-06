package hu.rkoszegi.balancer.web.controllers;

import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.services.TaskService;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private TaskService taskService;


    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @RequestMapping(value = "/project/{projectId}/tasks", method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Task> listAllProjectTasks(@PathVariable String projectId){
        log.debug("listAllProjectTasks called");
        return taskService.listProjectTasks(projectId);
    }

    @RequestMapping(value = "/task/{id}", method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Task getTask(@PathVariable String id){
        log.debug("getTask called");
        return taskService.getTaskById(id);
    }

    @RequestMapping(value = "/task", method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Task> getTasks(){
        log.debug("getTasks called");
        return taskService.findAllTask();
    }

    @RequestMapping(value = "/project/{projectId}/tasks", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public TaskDTO addTaskToProject(@PathVariable String projectId, @RequestBody Task task){
        log.debug("addTaskToProject called");
        return taskService.createTask(projectId, task);
    }

    @RequestMapping(value = "/task", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateTask(@RequestBody TaskDTO task){
        log.debug("updateTask called");
        taskService.updateTask(task);
        return new ResponseEntity<>("Task updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/task/batch", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateTask(@RequestBody List<TaskDTO> tasks){
        log.debug("updateTask called");
        tasks.forEach(taskService::updateTask);
        return new ResponseEntity<>("Task updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/task/{id}/complete", method = RequestMethod.PUT)
    public ResponseEntity<Date> completeTask(@PathVariable String id){
        log.debug("completeTask called");
        Date completionDate = taskService.completeTask(id);
        return ResponseEntity.ok(completionDate);
    }

    @RequestMapping(value="/task/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity deleteTask(@PathVariable String id){
        log.debug("deleteTask called");
        taskService.deleteTask(id);
        return new ResponseEntity<>("Task deleted successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/task/date/{year}/{month}/{day}", method= RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskDTO> getTasksForDate(@PathVariable("year") int year, @PathVariable("month") int month, @PathVariable("day") int day){
        log.debug("getTasksForDate called");
        LocalDate localDate = LocalDate.of(year, month, day);
        return taskService.findTasksForDate(localDate);
    }
}
