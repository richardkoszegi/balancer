import {Component, OnDestroy, OnInit} from '@angular/core';
import {Task} from "../../../model/Task";
import {UserService} from "../../../services/user.service";
import {Project} from "../../../model/Project";
import {Router} from "@angular/router";
import {ProjectService} from "../../../services/project.service";
import {AlertService} from "../../../services/alert.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.css']
})
export class ProjectTasksComponent implements OnInit, OnDestroy {

  project: Project;
  projectSubscription: Subscription;

  constructor(private alertService: AlertService,
              private userService: UserService,
              private projectService: ProjectService,
              private router: Router) { }

  ngOnInit() {
    this.project = this.projectService.project;
    this.projectSubscription = this.projectService.projectChanged.subscribe(() => {
      this.project = this.projectService.project;
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  canUserEditTask(task: Task): boolean {
    return this.projectService.canUserEditTask(task);
  }

  onAddTask() {
    this.router.navigate(['projects', this.project.id, 'task', 'new']);
  }

  onTaskCompleted(task: Task) {
    this.projectService.completeTask(task).subscribe(() => {
      this.alertService.success("Task completed!");
    })
  }

  onEditTask(taskId: string) {
    this.router.navigate(['projects', this.project.id, 'tasks', taskId, 'edit']);
  }

  onDeleteTask(task: Task): void {
    this.projectService.deleteTask(task).subscribe(() => {
      this.alertService.info("Task deleted!");
    })
  }
}
