import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task} from "../../../model/Task";
import {TaskService} from "../../../services/TaskService";

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.css']
})
export class NewTaskModalComponent implements OnInit {

  @Input()
  projectId: string;

  @Input()
  tasks: Task[];

  @Output() taskCreated: EventEmitter<Task> = new EventEmitter<Task>();

  newTaskForm: FormGroup;

  constructor(private taskService: TaskService) {
  }

  initForm(): void {
    this.newTaskForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'plannedDate': new FormControl(''),
      'description': new FormControl('')
    });
  }

  ngOnInit() {
    this.initForm();
  }

  onCreateTask() {
    this.taskService.createForProject(this.projectId, this.newTaskForm.value).subscribe(
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
    this.newTaskForm.reset();
  }

  onCancelCreateTask(): void {
    this.newTaskForm.reset();
  }

}
