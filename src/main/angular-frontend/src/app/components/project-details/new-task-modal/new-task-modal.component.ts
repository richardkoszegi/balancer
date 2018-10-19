import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Priority} from "../../../model/Priority";
import {ProjectDetailsService} from "../../../services/ProjectDetailsService";

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.css']
})
export class NewTaskModalComponent implements OnInit {

  newTaskForm: FormGroup;

  priorities: string[];

  constructor(private projectDetailsService: ProjectDetailsService) {
  }

  initForm(): void {
    this.newTaskForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'priority': new FormControl(''),
      'plannedDate': new FormControl(''),
      'description': new FormControl('')
    });
  }

  ngOnInit() {
    //help from: https://stackoverflow.com/a/49417089
    //and https://stackoverflow.com/a/48610402
    this.priorities = Object.values(Priority).filter(priority => typeof priority == "string");
    this.initForm();
  }

  onCreateTask() {
    this.projectDetailsService.createTaskForProject(this.newTaskForm.value);
    this.newTaskForm.reset();
  }

  onCancelCreateTask(): void {
    this.newTaskForm.reset();
  }

}
