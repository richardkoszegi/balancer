package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.LocalDate;
import java.time.ZoneId;


@Service
@Slf4j
public class TaskServiceImpl implements TaskService {

    private ProjectRepository projectRepository;
    private TaskRepository taskRepository;


    @Autowired
    public TaskServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public Iterable<Task> listProjectTasks(String projectID) {
        log.debug("getProjectTasks called");
        Project project = projectRepository.findById(projectID).block();
        return project.getTasks();
    }

    @Override
    public Task getTaskById(String taskID) {
        log.debug("getTaskById called");
        return taskRepository.findById(taskID).block();
    }

    @Override
    public void saveTask(Task task) {
        log.debug("saveTask called");
        taskRepository.save(task).block();
    }

    @Override
    public Iterable<Task> findAllTask() {
        log.debug("findAllTask called");
        return taskRepository.findAll().collectList().block();
    }

    @Override
    public void deleteTask(String id) {
        log.debug("deleteTask called");
        taskRepository.deleteById(id).block();
    }

    @Override
    public Iterable<Task> findTasksForDate(LocalDate date) {
        log.debug("findTasksForDate called");
        LocalDate to = date.plusDays(1);
        return taskRepository.findAllByPlannedDateBetween(
                date.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant(),
                to.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant()).collectList().block();
    }
}
