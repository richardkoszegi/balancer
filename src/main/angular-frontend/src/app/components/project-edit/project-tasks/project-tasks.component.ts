import { Component, OnInit } from '@angular/core';
import {Task} from "../../../model/Task";
import {UserService} from "../../../services/UserService";
import {Project} from "../../../model/Project";
import {Router} from "@angular/router";
import {ProjectDetailsService} from "../../../services/ProjectDetailsService";
import {AlertService} from "../../../services/AlertService";

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.css']
})
export class ProjectTasksComponent implements OnInit {

  project: Project;

  constructor(private alertService: AlertService,
              private userService: UserService,
              private projectDetailsService: ProjectDetailsService,
              private router: Router) { }

  ngOnInit() {
    this.project = this.projectDetailsService.project;
    this.projectDetailsService.projectChanged.subscribe(() => {
      this.project = this.projectDetailsService.project;
    });
  }

  canUserEditTask(task: Task): boolean {
    return (this.userService.isUserLoggedIn() && this.userService.user.username === task.assignedUser) || this.isUserOwner();
  }

  isUserOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }

  onAddTask() {
    this.router.navigate(['projects', this.project.id, 'task', 'new']);
  }

  onTaskCompleted(task: Task) {
    this.projectDetailsService.completeTask(task).subscribe(() => {
      this.alertService.success("Task completed!");
    })
  }

  onEditTask(taskId: string) {
    this.router.navigate(['projects', this.project.id, 'tasks', taskId, 'edit']);
  }

  onDeleteTask(task: Task): void {
    this.projectDetailsService.deleteTask(task).subscribe(() => {
      this.alertService.info("Task deleted!");
    })
  }
}
