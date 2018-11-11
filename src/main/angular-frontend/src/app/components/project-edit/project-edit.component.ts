import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProjectDetailsService} from "../../services/ProjectDetailsService";
import {Project} from "../../model/Project";

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  view = 'details';

  projectId: string;
  project: Project;

  constructor(private route: ActivatedRoute,
              private projectDetailsService: ProjectDetailsService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let projectId = params['projectId'];
        this.projectId = projectId;
        this.initProject(projectId);
      });
  }

  private initProject(projectId: string) {
    this.projectDetailsService.initTasks(projectId).subscribe(project => {
      this.project = project;
    });
  }

  navigateToPage(pageId: string) {
    this.view = pageId;
    this.router.navigate(['/projects', this.projectId, pageId]);
  }

  goBackToProjects(): void {
    this.router.navigate(['/projects']);
  }
}
