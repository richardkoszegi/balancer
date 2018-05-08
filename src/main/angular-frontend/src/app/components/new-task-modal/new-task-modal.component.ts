import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Task} from "../../model/Task";
import {TaskService} from "../../services/TaskService";

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styles: [`
    .form-horizontal {
      margin: 0 20px;
    }`]
})
export class NewTaskModalComponent implements OnInit {

  @Input()
  projectId: string;

  @Input()
  tasks: Task[];

  @Output() taskCreated: EventEmitter<Task> = new EventEmitter<Task>();

  newTaskForm: FormGroup;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
  }

  initForm(): void {
    this.newTaskForm = this.fb.group({
      'name': [''],
      'plannedDate': [''],
      'description': ['']
    });
  }

  ngOnInit() {
    this.initForm();
  }

  onCreateTask() {
    let task = new Task();
    task.name = this.newTaskForm.controls['name'].value;
    task.plannedDate = this.newTaskForm.controls["plannedDate"].value;
    task.description = this.newTaskForm.controls["description"].value;
    this.taskService.createForProject(this.projectId, task).subscribe(
      data => {
        let createdTask = new Task();
        createdTask.copyFrom(data);
        this.tasks.push(createdTask);
        this.taskCreated.emit(createdTask);
      },
      error => {
        alert(error);
        console.log(error)
      },
    );
    this.initForm();
  }

  onCancelCreateTask(): void {
    this.initForm();
  }

}
