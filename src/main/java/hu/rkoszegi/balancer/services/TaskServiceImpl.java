package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.TaskRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import hu.rkoszegi.balancer.web.mapper.TaskMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class TaskServiceImpl implements TaskService {

    private ProjectRepository projectRepository;
    private TaskRepository taskRepository;
    private UserService userService;
    private TaskMapper taskMapper;


    public TaskServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository, UserService userService, TaskMapper taskMapper) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userService = userService;
        this.taskMapper = taskMapper;
    }

    @Override
    public Iterable<Task> listProjectTasks(String projectID) {
        log.debug("getProjectTasks called");
        Project project = projectRepository.findById(projectID).blockOptional().orElse(null);
        return project != null ? project.getTasks() : null;
    }

    @Override
    public Task getTaskById(String taskID) {
        log.debug("getTaskById called");
        return taskRepository.findById(taskID).blockOptional().orElse(null);
    }

    @Override
    public void saveTask(Task task) {
        log.debug("saveTask called");
        taskRepository.save(task).block();
    }

    @Override
    public Iterable<Task> findAllTask() {
        log.debug("findAllTask called");
        return taskRepository.findAllByAssignedUser(userService.getLoggedInUser()).collectList().block();
    }

    @Override
    public void deleteTask(String id) {
        log.debug("deleteTask called");
        Optional<Task> taskOptional = taskRepository.findById(id).blockOptional();
        if (taskOptional.isPresent()) {
            Task deletedTask = taskOptional.get();
            User loggedInUser = userService.getLoggedInUser();
            if (userCanModifyTask(loggedInUser, deletedTask)) {
                taskRepository.deleteById(id).block();
            } else {
                throw new BadRequestException("User can't delete this task");
            }
        } else {
            throw new BadRequestException("Task does not exists!");
        }
    }

    @Override
    public Iterable<TaskDTO> findTasksForDate(LocalDate date) {
        log.debug("findTasksForDate called");
        LocalDate to = date.plusDays(1);
        Iterable<Task> tasks = taskRepository.findAllByAssignedUserAndPlannedDateBetween(
                userService.getLoggedInUser(),
                date.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant(),
                to.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant()).collectList().block();
        List<TaskDTO> resultList = new ArrayList<>();
        tasks.forEach(task -> resultList.add(taskMapper.toDto(task)));
        return resultList;
    }

    @Override
    public void updateTask(TaskDTO taskDTO) {
        log.debug("updateTask called");
        Task storedTask = getTaskById(taskDTO.getId());
        User loggedInUser = userService.getLoggedInUser();
        if (userCanModifyTask(loggedInUser, storedTask)) {
            storedTask.setCompleted(taskDTO.isCompleted());
            storedTask.setCompletionDate(taskDTO.getCompletionDate());
            storedTask.setDescription(taskDTO.getDescription());
            storedTask.setName(taskDTO.getName());
            storedTask.setPlannedDate(taskDTO.getPlannedDate());
            storedTask.setPriority(taskDTO.getPriority());
            storedTask.setAssignedToDate(taskDTO.isAssignedToDate());
            storedTask.setEstimatedTime(taskDTO.getEstimatedTime());
            if (userOwnsProject(loggedInUser, storedTask.getProject())) {
                User newAssignee = userService.getUserByUsername(taskDTO.getAssignedUser());
                storedTask.setAssignedUser(newAssignee);
            }
            saveTask(storedTask);
        } else {
            throw new BadRequestException("User can't modify this task");
        }
    }

    private boolean userOwnsProject(User user, Project project) {
        return user.equals(project.getOwner());
    }

    private boolean userCanModifyTask(User user, Task task) {
        return user.equals(task.getAssignedUser()) || user.equals(task.getProject().getOwner());
    }

    @Override
    public TaskDTO createTask(String projectId, Task task) {
        log.debug("createTask called");
        Optional<Project> projectOptional = projectRepository.findById(projectId).blockOptional();
        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();
            User loggedInUser = userService.getLoggedInUser();
            if (userCanCreateTask(loggedInUser, project)) {
                task.setAssignedUser(loggedInUser);
                task.setProject(project);
                taskRepository.save(task).block();
                project.getTasks().add(task);
                projectRepository.save(project).block();
                return taskMapper.toDto(task);
            } else {
                throw new BadRequestException("User can't create the task");
            }
        } else {
            throw new BadRequestException("Project does not exists!");
        }
    }

    @Override
    public Date completeTask(String taskId) {
        log.debug("completeTask called");
        Task storedTask = getTaskById(taskId);
        User loggedInUser = userService.getLoggedInUser();
        if (userCanModifyTask(loggedInUser, storedTask)) {
            storedTask.setCompleted(true);
            storedTask.setCompletionDate(new Date());
            saveTask(storedTask);
            return storedTask.getCompletionDate();
        } else {
            throw new BadRequestException("User can't update this task");
        }
    }

    private boolean userCanCreateTask(User user, Project project) {
        return project.getMembers().contains(user) || project.getOwner().equals(user);
    }
}
