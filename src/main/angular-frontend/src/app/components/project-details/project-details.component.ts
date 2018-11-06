import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {Project} from "../../model/Project";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertService} from "../../services/AlertService";
import {Task} from "../../model/Task";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectDetailsService} from "../../services/ProjectDetailsService";
import {UserService} from "../../services/UserService";

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
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let projectId = params['projectId'];
        this.projectDetailsService.initTasks(projectId).subscribe( project => {
          this.project = project;
          this.initForm();
        });
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

  deleteTask(task: Task): void {
    this.projectDetailsService.deleteTask(task).subscribe( () => {
      this.alertService.info("Task deleted!");
    })
  }

  goBack(): void {
    this.location.back();
  }

  onTaskCompleted(task: Task) {
    this.projectDetailsService.completeTask(task).subscribe(() => {
      this.alertService.success("Task completed!");
    } )
  }

  onAddTask() {
    this.router.navigate(['projects', this.project.id, 'task', 'new']);
  }

  onEditTask(taskId: string) {
    this.router.navigate(['projects', this.project.id, 'tasks', taskId, 'edit']);
  }

  isUserOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }
}
