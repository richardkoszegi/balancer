package hu.rkoszegi.balancer.services;

import hu.rkoszegi.balancer.model.Project;
import hu.rkoszegi.balancer.model.Task;
import hu.rkoszegi.balancer.model.User;
import hu.rkoszegi.balancer.repositories.ProjectRepository;
import hu.rkoszegi.balancer.repositories.UserRepository;
import hu.rkoszegi.balancer.services.exception.BadRequestException;
import hu.rkoszegi.balancer.web.dto.ProjectDTO;
import hu.rkoszegi.balancer.web.mapper.ProjectMapper;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.web.server.MethodNotAllowedException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class ProjectServiceTest {

    private static final String LOGGED_IN_USER_NAME = "LoggedInUserName";
    private static final String TEST_PROJECT_ID = "TestProjectId";

    private ProjectRepository projectRepository;
    private UserRepository userRepository;

    private TaskService taskService;
    private ProjectService projectService;

    private ProjectMapper projectMapper;
    
    private User loggedInUser;
    private Project testProject;

    @Before
    public void setUp() {
        this.projectRepository = Mockito.mock(ProjectRepository.class);
        this.userRepository = Mockito.mock(UserRepository.class);
        this.taskService = Mockito.mock(TaskService.class);
        this.projectMapper = Mockito.mock(ProjectMapper.class);
        SessionService sessionService = Mockito.mock(SessionService.class);
        this.projectService = new ProjectServiceImpl(projectRepository, userRepository, taskService, sessionService, projectMapper);

        initLoggedInUser();
        initTestProject();

        given(sessionService.getLoggedInUser()).willReturn(loggedInUser);

        given(projectRepository.findById(TEST_PROJECT_ID))
                .willReturn(Mono.just(testProject));

        given(taskService.saveTask(any(Task.class))).willReturn(Mono.empty());
    }

    private void initLoggedInUser() {
        loggedInUser = User.builder().username(LOGGED_IN_USER_NAME).build();
    }

    private void initTestProject() {
        Set<Task> tasks = new HashSet<>(Arrays.asList(
                Task.builder().id("1").build(),
                Task.builder().id("2").build()));

        testProject = Project.builder()
                .id(TEST_PROJECT_ID)
                .owner(loggedInUser)
                .members(new ArrayList<>())
                .tasks(tasks).build();
    }

    @Test
    public void listUserProjectsTest() {
        given(projectRepository.findAllByOwner(loggedInUser))
                .willReturn(Flux.just(new Project()));
        given(projectRepository.findAllByMembersContaining(loggedInUser))
                .willReturn(Flux.just(new Project()));
        given(projectMapper.toDto(any(Project.class))).willReturn(new ProjectDTO());

        List<ProjectDTO> userProjects = projectService.listAllProjects().collectList().block();

        verify(projectRepository).findAllByOwner(loggedInUser);
        verify(projectRepository).findAllByMembersContaining(loggedInUser);
        Assert.assertNotNull(userProjects);
        Assert.assertEquals(2, userProjects.size());
    }

    @Test
    public void findProjectByIdTest() {
        given(projectMapper.toDto(any(Project.class)))
                .willReturn(ProjectDTO.builder().id(TEST_PROJECT_ID).build());

        ProjectDTO projectDTO = projectService.findProjectById(TEST_PROJECT_ID).block();

        verify(projectRepository).findById(TEST_PROJECT_ID);
        verify(projectMapper).toDto(testProject);
        Assert.assertNotNull(projectDTO);
        Assert.assertEquals(TEST_PROJECT_ID, projectDTO.getId());
    }

    @Test
    public void createProjectTest() {
        Project project = new Project();
        given(projectRepository.save(project)).willReturn(Mono.just(project));
        given(projectMapper.toDto(project))
                .willReturn(ProjectDTO.builder()
                        .ownerName(loggedInUser.getUsername()).build());

        ProjectDTO createdProject = projectService.createProject(project).block();

        verify(projectRepository).save(project);
        verify(projectMapper).toDto(project);
        Assert.assertEquals(LOGGED_IN_USER_NAME, createdProject.getOwnerName());
    }

    @Test(expected = MethodNotAllowedException.class)
    public void updateNotOwnedProjectTest() {
        ProjectDTO dto = ProjectDTO.builder().ownerName("AnotherUser").build();
        Mono<Void> returnValue = projectService.updateProject(dto);
    }

    @Test(expected = BadRequestException.class)
    public void updateNotExistingProjectTest() {
        String notExistingId = "NotExistingId";
        ProjectDTO dto = ProjectDTO.builder()
                .id(notExistingId)
                .ownerName(LOGGED_IN_USER_NAME).build();

        given(projectRepository.findById(notExistingId))
                .willReturn(Mono.empty());

        Mono<Void> returnValue = projectService.updateProject(dto);
    }

    @Test
    public void updateProjectTest() {
        String name = "name";
        Date deadline = new Date();
        String description = "description";
        ProjectDTO dto = ProjectDTO.builder()
                .id(TEST_PROJECT_ID)
                .name(name)
                .deadline(deadline)
                .description(description)
                .ownerName(LOGGED_IN_USER_NAME).build();

        given(projectRepository.save(testProject)).willReturn(Mono.empty());

        projectService.updateProject(dto).block();

        verify(projectRepository).findById(TEST_PROJECT_ID);
        verify(projectRepository).save(testProject);

        Assert.assertEquals(name, testProject.getName());
        Assert.assertEquals(deadline, testProject.getDeadline());
        Assert.assertEquals(description, testProject.getDescription());
    }

    @Test
    public void deleteProjectTest() {
        given(projectRepository.deleteById(any(String.class))).willReturn(Mono.empty());

        projectService.deleteProject(TEST_PROJECT_ID).block();

        verify(taskService, times(2)).deleteTask(any(String.class));
        verify(projectRepository).deleteById(any(String.class));
    }

    @Test(expected = BadRequestException.class)
    public void updateMembersWithNonExistingOneTest() {
        List<String> newMembers = Collections.singletonList("notExistingMember");
        given(userRepository.findUserByUsername(any())).willReturn(Mono.empty());

        Mono<Void> returnValue = projectService.updateProjectMembers(TEST_PROJECT_ID, newMembers);
    }

    @Test
    public void updateProjectMembersTest() {
        List<String> newMembers = Arrays.asList("member1", "member2");
        given(userRepository.findUserByUsername(any())).willReturn(Mono.just(new User()));
        given(projectRepository.save(testProject)).willReturn(Mono.empty());

        Mono<Void> returnValue = projectService.updateProjectMembers(TEST_PROJECT_ID, newMembers);
        
        verify(projectRepository).save(testProject);
        Assert.assertEquals(2, testProject.getMembers().size());
    }

    @Test
    public void updateAssignedUserWhenUserRemovedFromProjectTest() {

        User member = User.builder().id("member").username("member").build();

        Task task = Task.builder().assignedUser(member).build();

        testProject.getTasks().add(task);
        testProject.getMembers().add(member);

        List<String> newMembers = Arrays.asList("anotherUser");
        given(userRepository.findUserByUsername(any())).willReturn(Mono.just(new User()));
        given(projectRepository.save(testProject)).willReturn(Mono.empty());

        Mono<Void> returnValue = projectService.updateProjectMembers(TEST_PROJECT_ID, newMembers);

        Assert.assertEquals(loggedInUser, task.getAssignedUser());
    }
}
