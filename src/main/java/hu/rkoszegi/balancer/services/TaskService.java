package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Task;

public interface TaskService {
    Iterable<Task> listProjectTasks(String projectID);

    Task getTaskById(String taskID);

    void saveTask(Task task);

    Iterable<Task> findAllTask();

    void deleteTask(String id);
}
