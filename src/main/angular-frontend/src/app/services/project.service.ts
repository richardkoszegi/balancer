import {TaskClient} from "./clients/task.client";
import {Injectable} from "@angular/core";
import {Project} from "../model/Project";
import {Task} from "../model/Task";
import {ProjectClient} from "./clients/project.client";
import {Observable, Subject} from "rxjs";
import "rxjs/Rx";
import {UserService} from "./user.service";

@Injectable()
export class ProjectService {

  project: Project;

  projectChanged = new Subject<any>();
  tasksChanged = new Subject<any>();

  constructor(private projectClient: ProjectClient,
              private taskClient: TaskClient,
              private userService: UserService) {
  }

  initProject(projectId): Observable<Project> {
    return this.projectClient.getProject(projectId).map(project => {
      this.project = project;
      this.projectChanged.next();
      return project;
    });
  }

  modifyProject() {
    return this.projectClient.modifyProject(this.project);
  }

  createTaskForProject(newTask: Task) {
    this.taskClient.createForProject(this.project.id, newTask).subscribe( (task: Task) => {
      this.project.tasks.push(task);
      this.tasksChanged.next(this.project.tasks);
    });
  }

  updateTask(task: Task): Observable<any> {
    return this.taskClient.updateTask(task).map( () => {
      this.tasksChanged.next(this.project.tasks);
    });
  }

  deleteTask(task: Task): Observable<any> {
    return this.taskClient.deleteTask(task.id).map(() => {
      let index = this.project.tasks.indexOf(task, 0);
      this.project.tasks.splice(index, 1);
      this.tasksChanged.next(this.project.tasks);
    })
  }

  completeTask(task: Task): Observable<any> {
    return this.taskClient.completeTask(task.id).map((completionDate: Date) => {
      task.completed = true;
      task.completionDate = completionDate;
    });
  }

  getTaskById(taskId: string): Task {
    return this.project.tasks[this.project.tasks.findIndex(task => task.id === taskId)];
    // return this.project.tasks.find(task => task.id === taskId);
  }

  isUserOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }

  canUserEditTask(task: Task): boolean {
    return (this.userService.isUserLoggedIn() && this.userService.user.username === task.assignedUser) || this.isUserOwner();
  }

  updateMembers(): Observable<any> {
    return this.projectClient.updateProjectMembers(this.project).map(() => {
      this.initProject(this.project.id).subscribe();
    });
  }

}
