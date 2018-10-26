package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        Project project = projectRepository.findById(projectID).orElse(null);
        return project != null ? project.getTasks() : null;
    }

    @Override
    public Task getTaskById(String taskID) {
        log.debug("getTaskById called");
        return taskRepository.findById(taskID).orElse(null);
    }

    @Override
    public void saveTask(Task task) {
        log.debug("saveTask called");
        taskRepository.save(task);
    }

    @Override
    public Iterable<Task> findAllTask() {
        log.debug("findAllTask called");
        return taskRepository.findAll();
    }

    @Override
    public void deleteTask(String id) {
        log.debug("deleteTask called");
        taskRepository.deleteById(id);
    }

    @Override
    public Iterable<Task> findTasksForDate(LocalDate date) {
        log.debug("findTasksForDate called");
        LocalDate to = date.plusDays(1);
        return taskRepository.findAllByPlannedDateBetween(
                date.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant(),
                to.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant());
    }

    @Override
    public void updateTask(Task task) {
        log.debug("updateTask called");
        Task storedTask = getTaskById(task.getId());
        storedTask.setCompleted(task.getCompleted());
        storedTask.setCompletionDate(task.getCompletionDate());
        storedTask.setDescription(task.getDescription());
        storedTask.setName(task.getName());
        storedTask.setPlannedDate(task.getPlannedDate());
        storedTask.setPriority(task.getPriority());
        storedTask.setAssignedToDate(task.isAssignedToDate());
        storedTask.setEstimatedTime(task.getEstimatedTime());
        saveTask(task);
    }
}
