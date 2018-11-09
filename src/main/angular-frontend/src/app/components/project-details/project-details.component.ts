import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {Project} from "../../model/Project";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertService} from "../../services/AlertService";
import {Task} from "../../model/Task";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectDetailsService} from "../../services/ProjectDetailsService";
import {UserService} from "../../services/UserService";
import {ProjectService} from "../../services/ProjectService";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;

  projectForm: FormGroup;

  selectableUsers: string[] = [];
  membersChanged = false;


  constructor(private alertService: AlertService,
              private projectDetailsService: ProjectDetailsService,
              private projectService: ProjectService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let projectId = params['projectId'];
        this.initProject(projectId);
      });
  }

  private initProject(projectId: string) {
    this.projectDetailsService.initTasks(projectId).subscribe(project => {
      this.project = project;
      this.initForm();

      if (this.isUserOwner()) {
        this.initSelectableUsers();
      }
    });
  }

  initForm() {
    this.projectForm = new FormGroup({
      'name': new FormControl({value: this.project.name, disabled: !this.isUserOwner()}, Validators.required),
      'deadline': new FormControl({value: this.project.deadline, disabled: !this.isUserOwner()}, Validators.required),
      'description': new FormControl({value: this.project.description, disabled: !this.isUserOwner()})
    });
  }

  private initSelectableUsers() {
    this.userService.getAllUserName().subscribe((userNames: string[]) => {
      this.selectableUsers = userNames;
      for (const userName of this.project.memberNames) {
        this.removeUserFromSelectableUsers(userName);
      }
      this.removeUserFromSelectableUsers(this.project.ownerName);
    })
  }

  private removeUserFromSelectableUsers(user: string) {
    this.selectableUsers.splice(this.selectableUsers.indexOf(user), 1);
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
    this.projectDetailsService.deleteTask(task).subscribe(() => {
      this.alertService.info("Task deleted!");
    })
  }

  goBack(): void {
    this.location.back();
  }

  onTaskCompleted(task: Task) {
    this.projectDetailsService.completeTask(task).subscribe(() => {
      this.alertService.success("Task completed!");
    })
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

  addUserToMembers(userName: string) {
    this.removeUserFromSelectableUsers(userName);
    this.project.memberNames.push(userName);
    this.membersChanged = true;
  }

  removeUserFromMembers(userName: string) {
    this.project.memberNames.splice(this.project.memberNames.indexOf(userName), 1);
    this.selectableUsers.push(userName);
    this.membersChanged = true;
  }

  onUpdateMembers() {
    this.projectService.updateProjectMembers(this.project).subscribe(() => {
      this.initProject(this.project.id);
      this.alertService.success('Members updated!');
    });
  }

  canUserEditTask(task: Task): boolean {
    return (this.userService.isUserLoggedIn() && this.userService.user.username === task.assignedUser) || this.isUserOwner();
  }

}
