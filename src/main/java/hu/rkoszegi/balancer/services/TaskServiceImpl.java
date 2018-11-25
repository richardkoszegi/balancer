package hu.rkoszegi.balancer.services;


import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.TaskRepository;
import hu.rkoszegi.balancer.repositories.UserRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.TaskDTO;
import hu.rkoszegi.balancer.web.mapper.TaskMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;


@Service
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SessionService sessionService;
    private final TaskMapper taskMapper;


    public TaskServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository, UserRepository userRepository, SessionService sessionService, TaskMapper taskMapper) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.sessionService = sessionService;
        this.taskMapper = taskMapper;
    }

    @Override
    public Flux<Task> listProjectTasks(String projectID) {
        log.debug("getProjectTasks called");
        Mono<Project> project = projectRepository.findById(projectID);
        return project.flatMapIterable(Project::getTasks);
    }

    @Override
    public Mono<Task> getTaskById(String taskID) {
        log.debug("getTaskById called");
        return taskRepository.findById(taskID);
    }

    @Override
    public Flux<Task> findAllTask() {
        log.debug("findAllTask called");
        return taskRepository.findAllByAssignedUser(sessionService.getLoggedInUser());
    }

    @Override
    public Mono<Void> saveTask(Task task) {
        log.debug("saveTask called");
        return taskRepository.save(task).then();
    }

    @Override
    public Mono<Void> deleteTask(String id) {
        log.debug("deleteTask called");
        Optional<Task> taskOptional = taskRepository.findById(id).blockOptional();
        if (taskOptional.isPresent()) {
            Task deletedTask = taskOptional.get();
            User loggedInUser = sessionService.getLoggedInUser();
            if (userCanModifyTask(loggedInUser, deletedTask)) {
                return taskRepository.deleteById(id).then();
            } else {
                throw new BadRequestException("User can't delete this task");
            }
        } else {
            throw new BadRequestException("Task does not exists!");
        }
    }

    @Override
    public Flux<TaskDTO> findTasksForDate(LocalDate date) {
        log.debug("findTasksForDate called");
        LocalDate to = date.plusDays(1);
        Flux<Task> tasks = taskRepository.findAllByAssignedUserAndPlannedDateBetween(
                sessionService.getLoggedInUser(),
                date.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant(),
                to.atStartOfDay().atZone(ZoneId.of("Europe/Paris")).toInstant());
        return tasks.map(taskMapper::toDto);
    }

    @Override
    public Mono<Void> updateTask(TaskDTO taskDTO) {
        log.debug("updateTask called");
        Optional<Task> storedTaskOptional = getTaskById(taskDTO.getId()).blockOptional();
        User loggedInUser = sessionService.getLoggedInUser();
        if (!storedTaskOptional.isPresent()) {
            throw new BadRequestException("Task does not exists");
        }

        Task storedTask = storedTaskOptional.get();
        if (!userCanModifyTask(loggedInUser, storedTask)) {
            throw new BadRequestException("User can't modify this task");
        }
        storedTask.setCompleted(taskDTO.isCompleted());
        storedTask.setCompletionDate(taskDTO.getCompletionDate());
        storedTask.setDescription(taskDTO.getDescription());
        storedTask.setName(taskDTO.getName());
        storedTask.setPlannedDate(taskDTO.getPlannedDate());
        storedTask.setPriority(taskDTO.getPriority());
        storedTask.setAssignedToDate(taskDTO.isAssignedToDate());
        storedTask.setEstimatedTime(taskDTO.getEstimatedTime());
        if (userOwnsProject(loggedInUser, storedTask.getProject())) {
            Optional<User> optionalUser = userRepository.findUserByUsername(taskDTO.getAssignedUser()).blockOptional();
            if(optionalUser.isPresent()) {
                User newAssignee = optionalUser.get();
                storedTask.setAssignedUser(newAssignee);
            } else {
                throw new BadRequestException("Assigned user does not exists!");
            }

        }
        return saveTask(storedTask).then();
    }

    private boolean userCanModifyTask(User user, Task task) {
        return user.equals(task.getAssignedUser()) || user.equals(task.getProject().getOwner());
    }

    private boolean userOwnsProject(User user, Project project) {
        return user.equals(project.getOwner());
    }

    @Override
    public Mono<TaskDTO> createTask(String projectId, TaskDTO taskDTO) {
        log.debug("createTask called");
        Optional<Project> projectOptional = projectRepository.findById(projectId).blockOptional();
        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();
            User loggedInUser = sessionService.getLoggedInUser();
            if (userCanCreateTask(loggedInUser, project)) {
                Task task = taskMapper.toEntity(taskDTO);
                task.setAssignedUser(loggedInUser);
                task.setProject(project);
                taskRepository.save(task).block();
                project.getTasks().add(task);
                projectRepository.save(project).block();
                return Mono.just(taskMapper.toDto(task));
            } else {
                throw new BadRequestException("User can't create the task");
            }
        } else {
            throw new BadRequestException("Project does not exists!");
        }
    }

    @Override
    public Mono<Date> completeTask(String taskId) {
        log.debug("completeTask called");
        Optional<Task> storedTaskOptional = getTaskById(taskId).blockOptional();
        if(!storedTaskOptional.isPresent()) {
            throw new BadRequestException("Task does not exists!");
        }

        Task storedTask = storedTaskOptional.get();
        User loggedInUser = sessionService.getLoggedInUser();
        if (userCanModifyTask(loggedInUser, storedTask)) {
            storedTask.setCompleted(true);
            storedTask.setCompletionDate(new Date());
            saveTask(storedTask).block();
            return Mono.just(storedTask.getCompletionDate());
        } else {
            throw new BadRequestException("User can't update this task");
        }
    }

    private boolean userCanCreateTask(User user, Project project) {
        return project.getMembers().contains(user) || project.getOwner().equals(user);
    }
}
