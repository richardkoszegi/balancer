import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../model/Project";
import {Task} from "../../model/Task";
import {Priority} from "../../model/Priority";
import {DatePipe, Location} from "@angular/common";
import {ProjectClient} from "../../services/clients/project.client";
import {ProjectService} from "../../services/project.service";
import {AlertService} from "../../services/alert.service";
import {TaskClient} from "../../services/clients/task.client";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  editMode = false;
  projectCanBeChanged = true;
  taskId: string;
  projectId: string;
  plannedDate: string;
  calledFromDayPlanner = false;
  editedTask: Task;

  taskForm: FormGroup;

  projects: Project[];
  project: Project;
  assignableUsers: string[];

  priorities: string[];

  constructor(
    private alertService: AlertService,
    private datePipe: DatePipe,
    private projectClient: ProjectClient,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private taskClient: TaskClient,
    private location: Location) {
  }

  ngOnInit() {
    //help from: https://stackoverflow.com/a/49417089
    //and https://stackoverflow.com/a/48610402
    this.priorities = Object.values(Priority).filter(priority => typeof priority == "string");

    this.route.params
      .subscribe(
        (params: Params) => {
          this.projectId = params['projectId'];
          this.projectCanBeChanged = params['projectId'] == null;
          this.taskId = params['taskId'];
          this.editMode = params['taskId'] != null;
          this.plannedDate = params['dateParam'];
          this.calledFromDayPlanner = params['dateParam'] != null;
          this.projectClient.list().subscribe((projects: Project[]) => {
            this.projects = projects;
            if (!this.projectCanBeChanged) {
              this.project = this.projects.find(project => project.id === this.projectId);
            }
            if(!this.calledFromDayPlanner) {
              this.assignableUsers = this.project.memberNames.slice();
              this.assignableUsers.push(this.project.ownerName);
            }
            this.initForm();
          });
          if (this.editMode) {
            this.editedTask = this.projectService.getTaskById(this.taskId);
          }
        });
  }

  private initForm(): void {
    let name = '';
    let priority = 'C';
    let assignedUser = '';
    let plannedDate = '';
    let description = '';
    let completed = false;
    let completionDate = '';
    let projectId = '';

    if (this.editMode) {
      name = this.editedTask.name;
      priority = this.editedTask.priority.toString();
      assignedUser = this.editedTask.assignedUser;
      //date to string: https://stackoverflow.com/a/40460346
      plannedDate = this.datePipe.transform(this.editedTask.plannedDate, 'yyyy-MM-dd');
      description = this.editedTask.description;
      completed = this.editedTask.completed;
      completionDate = this.datePipe.transform(this.editedTask.completionDate, 'yyyy-MM-dd');
    }
    if (!this.projectCanBeChanged) {
      projectId = this.projectId;
    }
    if (this.calledFromDayPlanner) {
      plannedDate = this.plannedDate;
    }
    this.taskForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'projectId': new FormControl({value: projectId, disabled: !this.projectCanBeChanged}, Validators.required),
      'priority': new FormControl(priority),
      'assignedUser': new FormControl({value: assignedUser, disabled: !this.isEditorOwner()}),
      'plannedDate': new FormControl({value: plannedDate, disabled: this.calledFromDayPlanner}),
      'description': new FormControl(description),
      'completed': new FormControl(completed),
      'completionDate': new FormControl(completionDate)
    });
  }

  private isEditorOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.project && this.userService.user.username === this.project.ownerName;
  }

  onSubmit() {
    if (this.editMode) {
      this.updateEditedTaskFieldsFromForm();
      this.projectService.updateTask(this.editedTask).subscribe(() => {
        this.alertService.success('Task updated!');
        this.location.back();
      });
    } else if (this.calledFromDayPlanner) {
      let submittedTask: Task = this.taskForm.value;
      submittedTask.plannedDate = new Date(this.taskForm.get('plannedDate').value);
      this.taskClient.createForProject(this.taskForm.get('projectId').value, this.taskForm.value).subscribe(() => {
        this.alertService.success('Task Created');
        this.location.back();
      });
    } else {
      this.projectService.createTaskForProject(this.taskForm.value);
      this.taskForm.reset();
      this.location.back();
    }
  }

  private updateEditedTaskFieldsFromForm() {
    this.editedTask.name = this.taskForm.value['name'];
    this.editedTask.priority = this.taskForm.value['priority'];
    this.editedTask.plannedDate = this.taskForm.value['plannedDate'];
    this.editedTask.description = this.taskForm.value['description'];
    this.editedTask.completed = this.taskForm.value['completed'];
    this.editedTask.assignedUser = this.taskForm.value['assignedUser'];
    if (this.editedTask.completed) {
      this.editedTask.completionDate = this.taskForm.value['completionDate'];
    } else {
      this.editedTask.completionDate = null;
    }
  }

  onCancelCreateTask() {
    this.initForm();
    this.location.back();
  }

}
