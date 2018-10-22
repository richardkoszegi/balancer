import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Priority} from "../../../model/Priority";
import {ProjectDetailsService} from "../../../services/ProjectDetailsService";
import {Task} from "../../../model/Task";
import {AlertService} from "../../../services/AlertService";

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.css']
})
export class NewTaskModalComponent implements OnInit {

  newTaskForm: FormGroup;

  priorities: string[];

  editMode: boolean;

  @Input()
  editedTask: Task;

  constructor(
    private alertService: AlertService,
    private projectDetailsService: ProjectDetailsService
  ) {}

  initForm(): void {

    if(this.editMode) {
      this.newTaskForm = new FormGroup({
        'name': new FormControl(this.editedTask.name, Validators.required),
        'priority': new FormControl(this.editedTask.priority),
        'plannedDate': new FormControl(this.editedTask.plannedDate),
        'description': new FormControl(this.editedTask.description)
      });
    } else {
      this.newTaskForm = new FormGroup({
        'name': new FormControl('', Validators.required),
        'priority': new FormControl('C'),
        'plannedDate': new FormControl(''),
        'description': new FormControl('')
      });
    }
  }

  ngOnInit() {
    //help from: https://stackoverflow.com/a/49417089
    //and https://stackoverflow.com/a/48610402
    this.priorities = Object.values(Priority).filter(priority => typeof priority == "string");

    this.editMode = this.editedTask != null;

    this.initForm();
  }

  onSubmit() {
    if (this.editMode) {
      this.updateEditedTaskFieldsFromForm();
      this.projectDetailsService.updateTask(this.editedTask).subscribe(() => {
        this.alertService.success('Task updated!');
      });
    } else {
      this.projectDetailsService.createTaskForProject(this.newTaskForm.value);
      this.newTaskForm.reset();
    }
  }

  private updateEditedTaskFieldsFromForm() {
    this.editedTask.name = this.newTaskForm.value['name'];
    this.editedTask.priority = this.newTaskForm.value['priority'];
    this.editedTask.plannedDate = this.newTaskForm.value['plannedDate'];
    this.editedTask.description = this.newTaskForm.value['description'];
  }

  onCancelCreateTask(): void {
    this.newTaskForm.reset();
  }

}
