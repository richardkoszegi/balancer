import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/Project";
import {AlertService} from "../../../services/AlertService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectDetailsService} from "../../../services/ProjectDetailsService";
import {UserService} from "../../../services/UserService";
import {ProjectService} from "../../../services/ProjectService";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  projectForm: FormGroup;

  constructor(private alertService: AlertService,
              private projectDetailsService: ProjectDetailsService,
              private projectService: ProjectService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.project = this.projectDetailsService.project;
    if(this.project) {
      this.initForm();
    }
    this.projectDetailsService.projectChanged.subscribe(() => {
      this.project = this.projectDetailsService.project;
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

  modifyProject() {
    this.setProjectValuesFromForm();
    this.projectDetailsService.modifyProject().subscribe(() => {
      this.alertService.success("Project's data modified successfully!");
    });
  }

  private setProjectValuesFromForm() {
    this.project.name = this.projectForm.value['name'];
    this.project.deadline = this.projectForm.value['deadline'];
    this.project.description = this.projectForm.value['description'];
  }



  isUserOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }
}
