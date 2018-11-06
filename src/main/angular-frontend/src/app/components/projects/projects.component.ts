import {Component, OnInit} from '@angular/core';
import {Project} from "../../model/Project";
import {ProjectService} from "../../services/ProjectService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  newProjectForm: FormGroup;

  constructor(private projectService: ProjectService, private userService: UserService) {
  }

  initForm(): void {
    this.newProjectForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'deadline': new FormControl('', Validators.required),
      'description': new FormControl(''),
    });
  }

  ngOnInit() {
    this.initForm();
    this.projectService.list().subscribe(
      data => {
        this.projects = data;
      },
      error => alert(error),
    );
  }

  onCreateProject(): void {
    this.projectService.create(this.newProjectForm.value).subscribe(
      (project: Project) => {
        this.projects.push(project);
      },
      error => {
        alert(error);
        console.log(error)
      },
    );
    this.initForm();
  }

  onCancelCreateProject(): void {
    this.initForm();
  }

  onDeleteProject(project: Project): void {
    this.projectService.delete(project).subscribe(
      () => {
        //source: https://stackoverflow.com/a/15295806
        let index = this.projects.indexOf(project, 0);
        this.projects.splice(index, 1);
      },
      error => {
        alert(error);
        console.log(error)
      },
    );
  }

  isUserOwner(project: Project): boolean {
    return this.userService.isUserLoggedIn() && (project.ownerName === this.userService.user.username);
  }

}
