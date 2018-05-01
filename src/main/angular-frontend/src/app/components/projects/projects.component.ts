import {Component, OnInit} from '@angular/core';
import {Project} from "../../model/Project";
import {ProjectService} from "../../services/ProjectService";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Task} from "../../model/Task";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent implements OnInit {

  projects: Project[];
  newProjectForm: FormGroup;

  constructor(private projectService: ProjectService, private fb: FormBuilder) {
  }

  initForm(): void {
    this.newProjectForm = this.fb.group({
      'name': [''],
      'deadline': [''],
      'description': ['']
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
    let project = new Project(
      this.newProjectForm.controls['name'].value,
      this.newProjectForm.controls["deadline"].value,
      this.newProjectForm.controls["description"].value,
  );
    this.projectService.create(project).subscribe(
      data => {
        this.projects.push(data);
      },
      error => {alert(error);
      console.log(error)},
    );
    this.initForm();
  }

  onCancelCreateProject(): void {
    this.initForm();
  }

  onDeleteProject(project: Project): void {
    this.projectService.delete(project).subscribe(
      data => {
        //source: https://stackoverflow.com/a/15295806
        let index = this.projects.indexOf(project, 0);
        this.projects.splice(index, 1);
      },
      error => {alert(error);
        console.log(error)},
    );
  }

}
