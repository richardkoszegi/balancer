package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.web.dto.TaskDTO;

import java.time.LocalDate;
import java.util.Date;

public interface TaskService {
    Iterable<Task> listProjectTasks(String projectID);

    Task getTaskById(String taskID);

    void saveTask(Task task);

    Iterable<Task> findAllTask();

    void deleteTask(String id);

    Iterable<Task> findTasksForDate(LocalDate date);

    void updateTask(TaskDTO taskDTO);

    TaskDTO createTask(String projectId, Task task);

    Date completeTask(String taskId);
}
