import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {AlertService} from "../../../services/AlertService";
import {ProjectService} from "../../../services/ProjectService";
import {Project} from "../../../model/Project";
import {TaskService} from "../../../services/TaskService";
import {PlannedTask} from "../../../model/PlannedTask";

@Component({
  selector: 'app-new-day-task-modal',
  templateUrl: './new-day-task-modal.component.html',
  styleUrls: ['./new-day-task-modal.component.css']
})
export class NewDayTaskModalComponent implements OnInit {

  newTaskForm: FormGroup;

  priorities: string[];

  projects: Project[];

  @Output()
  taskCreated = new EventEmitter<Task>();

  @Input()
  plannedDate: Date;

  constructor(
    private alertService: AlertService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  initForm(): void {
      this.newTaskForm = new FormGroup({
        'name': new FormControl('', Validators.required),
        'priority': new FormControl('C'),
        'projectId': new FormControl('', Validators.required),
        'estimatedTime': new FormControl(''),
        'description': new FormControl(''),
      });
  }

  ngOnInit() {
    //help from: https://stackoverflow.com/a/49417089
    //and https://stackoverflow.com/a/48610402
    this.priorities = Object.values(Priority).filter(priority => typeof priority == "string");

    this.projectService.list().subscribe((projects: Project[]) => {
      this.projects = projects;
    });

    this.initForm();
  }

  onSubmit() {
    let task: Task = this.newTaskForm.value;
    task.plannedDate = this.plannedDate;
    task.estimatedTime = PlannedTask.convertEstimatedTime(this.newTaskForm.get('estimatedTime').value);
    const projectId = this.newTaskForm.get('projectId').value;
    this.taskService.createForProject(projectId, task).subscribe( (newTask: Task) => {
      this.taskCreated.next(newTask);
    });
      this.newTaskForm.reset();
  }

  onCancelCreateTask(): void {
      this.newTaskForm.reset();
  }
}
