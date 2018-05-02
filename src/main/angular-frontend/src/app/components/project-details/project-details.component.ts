import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {Project} from "../../model/Project";
import {ProjectService} from "../../services/ProjectService";
import {ActivatedRoute, Params} from "@angular/router";
import {AlertService} from "../../services/AlertService";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  constructor(private projectService: ProjectService,
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
        });
      });
  }

  modifyProject() {
    this.projectService.modifyProject(this.project).subscribe(data => this.alertService.success("Project's data modified successfully!"));
  }

  goBack(): void {
    this.location.back();
  }
}
