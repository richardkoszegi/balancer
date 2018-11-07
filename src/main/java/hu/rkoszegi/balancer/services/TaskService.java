package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Date;

public interface TaskService {
    Flux<Task> listProjectTasks(String projectID);

    Mono<Task> getTaskById(String taskID);

    Flux<Task> findAllTask();

    Mono<Void> deleteTask(String id);

    Flux<TaskDTO> findTasksForDate(LocalDate date);

    Mono<Void> updateTask(TaskDTO taskDTO);

    Mono<TaskDTO> createTask(String projectId, TaskDTO taskDTO);

    Mono<Date> completeTask(String taskId);
}
