import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {Project} from "../../model/Project";
import {ProjectService} from "../../services/ProjectService";
import {ActivatedRoute, Params} from "@angular/router";
import {AlertService} from "../../services/AlertService";
import {Task} from "../../model/Task";
import {TaskService} from "../../services/TaskService";
import {ProjectPlannerComponent} from "../project-planner/project-planner.component";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  @ViewChild(ProjectPlannerComponent) projectPlannerComponent: ProjectPlannerComponent;

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let projectId = params['projectId'];
        console.log(projectId);
        this.projectService.getProject(projectId).subscribe( project => {
          console.log(`project: ${project.deadline}`);
          this.project = project;
          console.log(this.project);
        });
      });
  }

  modifyProject() {
    this.projectService.modifyProject(this.project).subscribe(data => this.alertService.success("Project's data modified successfully!"));
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe( data => {
      let index = this.project.tasks.indexOf(task, 0);
      this.project.tasks.splice(index, 1);
      this.projectPlannerComponent.deleteTask(task);
      this.alertService.info("Task deleted!");
    })
  }

  onTaskCreated(task: Task): void {
    this.projectPlannerComponent.addNewTask(task);
  }

  goBack(): void {
    this.location.back();
  }
}
