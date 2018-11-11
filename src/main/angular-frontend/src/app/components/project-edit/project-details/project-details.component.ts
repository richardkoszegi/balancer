import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../../model/Project";
import {AlertService} from "../../../services/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../../../services/project.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  project: Project;
  projectForm: FormGroup;
  projectSubscription: Subscription;

  constructor(private alertService: AlertService,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.project = this.projectService.project;
    if (this.project) {
      this.initForm();
    }
    this.projectSubscription = this.projectService.projectChanged.subscribe(() => {
      this.project = this.projectService.project;
      this.initForm();
    });
  }

  initForm() {
    this.projectForm = new FormGroup({
      'name': new FormControl({value: this.project.name, disabled: !this.isUserOwner()}, Validators.required),
      'deadline': new FormControl({value: this.project.deadline, disabled: !this.isUserOwner()}, Validators.required),
      'description': new FormControl({value: this.project.description, disabled: !this.isUserOwner()})
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  modifyProject() {
    this.setProjectValuesFromForm();
    this.projectService.modifyProject().subscribe(() => {
      this.alertService.success("Project's data modified successfully!");
    });
  }

  private setProjectValuesFromForm() {
    this.project.name = this.projectForm.value['name'];
    this.project.deadline = this.projectForm.value['deadline'];
    this.project.description = this.projectForm.value['description'];
  }

  isUserOwner(): boolean {
    return this.projectService.isUserOwner();
  }
}
