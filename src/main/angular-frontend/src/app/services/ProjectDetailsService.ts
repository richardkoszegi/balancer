import {TaskService} from "./TaskService";
import {Injectable} from "@angular/core";
import {Project} from "../model/Project";
import {Task} from "../model/Task";
import {ProjectService} from "./ProjectService";
import {Observable, Subject} from "rxjs";
import "rxjs/Rx";

@Injectable()
export class ProjectDetailsService {

  project: Project;

  tasksChanged = new Subject<any>();

  constructor(private projectService: ProjectService,
              private taskService: TaskService) {
  }

  initTasks(projectId): Observable<Project> {
    return this.projectService.getProject(projectId).map(project => {
      this.project = project;
      return project;
    });
  }

  modifyProject() {
    return this.projectService.modifyProject(this.project);
  }

  createTaskForProject(newTask: Task) {
    this.taskService.createForProject(this.project.id, newTask).subscribe( (task: Task) => {
      this.project.tasks.push(task);
      this.tasksChanged.next(this.project.tasks);
    });
  }

  updateTask(task: Task): Observable<any> {
    return this.taskService.updateTask(task).map( () => {
      this.tasksChanged.next(this.project.tasks);
    });
  }

  deleteTask(task: Task): Observable<any> {
    return this.taskService.deleteTask(task.id).map(() => {
      let index = this.project.tasks.indexOf(task, 0);
      this.project.tasks.splice(index, 1);
      this.tasksChanged.next(this.project.tasks);
    })
  }

  completeTask(task: Task): Observable<any> {
    return this.taskService.completeTask(task.id).map((completionDate: Date) => {
      task.completed = true;
      task.completionDate = completionDate;
    });
  }

  getTaskById(taskId: string): Task {
    return this.project.tasks[this.project.tasks.findIndex(task => task.id === taskId)];
    // return this.project.tasks.find(task => task.id === taskId);
  }

}
