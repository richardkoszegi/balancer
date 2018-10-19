import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {Project} from "../../model/Project";
import {ProjectService} from "../../services/ProjectService";
import {ActivatedRoute, Params} from "@angular/router";
import {AlertService} from "../../services/AlertService";
import {Task} from "../../model/Task";
import {TaskService} from "../../services/TaskService";
import {ProjectPlannerComponent} from "./project-planner/project-planner.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  projectForm: FormGroup;

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
        this.projectService.getProject(projectId).subscribe( project => {
          this.project = project;
          this.initForm();
        });
      });
  }

  initForm() {
    this.projectForm = new FormGroup({
      'name': new FormControl(this.project.name, Validators.required),
      'deadline': new FormControl(this.project.deadline, Validators.required),
      'description': new FormControl(this.project.description)
    });
  }

  modifyProject() {
    this.setProjectValuesFromForm();
    this.projectService.modifyProject(this.project).subscribe(() => {
      this.alertService.success("Project's data modified successfully!");
    });
  }

  private setProjectValuesFromForm() {
    this.project.name = this.projectForm.value['name'];
    this.project.deadline = this.projectForm.value['deadline'];
    this.project.description = this.projectForm.value['description'];
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe( () => {
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

  onTaskCompleted(task: Task) {
    this.taskService.completeTask(task.id).subscribe((completionDate: Date) => {
      task.completed = true;
      task.completionDate = completionDate;
      this.alertService.success("Task completed!");
    } )
  }
}
