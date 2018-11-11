import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/Project";
import {AlertService} from "../../../services/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../../../services/project.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  projectForm: FormGroup;

  constructor(private alertService: AlertService,
              private projectService: ProjectService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.project = this.projectService.project;
    if(this.project) {
      this.initForm();
    }
    this.projectService.projectChanged.subscribe(() => {
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
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }
}
