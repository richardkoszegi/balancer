import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEventTimesChangedEvent} from "angular-calendar";
import {Subject} from "rxjs/Subject";
import {TaskService} from "../../services/TaskService";
import {AlertService} from "../../services/AlertService";
import {Task} from '../../model/Task';
import {Priority} from "../../model/Priority";
import {PlannedTask} from "../../model/PlannedTask";

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.css']
})
export class DailyPlannerComponent implements OnInit {

  view: string = 'day';

  viewDate: Date = new Date();

  @Input() locale: string = 'en';

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  externalEvents: PlannedTask[] = [];

  events: PlannedTask[] = [];

  refresh: Subject<any> = new Subject();

  tasks: Task[];

  priorities: string[];

  dataChanged = false;

  constructor(private taskService: TaskService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.priorities = Object.values(Priority).filter(priority => typeof priority == "string");
    this.initEvents();
  }

  initEvents() {
    this.events = [];
    this.externalEvents = [];
    this.taskService.getTasksForDate(this.viewDate).subscribe(tasks => {
      this.tasks = tasks;
      for (let task of tasks) {
        let event = new PlannedTask(task);
        if (task.assignedToDate) {
          event.setStartAndEndDate();
          this.events.push(event);
        } else {
          this.externalEvents.push(event);
        }
      }
      this.refresh.next();
    });
  }

  eventDropped({
                 event,
                 newStart,
                 newEnd
               }: CalendarEventTimesChangedEvent): void {

    const eventId = event.id;
    const externalIndex = this.externalEvents.findIndex(event => event.id == eventId);
    let modifiedTask: PlannedTask;
    if (externalIndex > -1) {
      modifiedTask = this.externalEvents[externalIndex];
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(modifiedTask);
    }
    modifiedTask.changeStart(newStart);
    modifiedTask.setStartAndEndDate();
    this.dataChanged = true;
    this.refresh.next();
    // let updatedTask = this.tasks.find((task) => task.name === event.title);
    // updatedTask.plannedDate = newStart;
    // updatedTask.assignedToDate = true;
    // if (newEnd) {
    //   event.end = newEnd;
    // }
    // this.taskService.updateTask(updatedTask).subscribe(data => {
    //   this.alertService.success("Task date modified!");
    //   this.refresh.next();
    // });
  }

  onSaveChanges() {
    let modifiedTasks = this.getModifiedTasks();
    this.taskService.updateTasks(modifiedTasks).subscribe(() => {
      this.dataChanged = false;
      this.alertService.success("Tasks updated!");
    })
  }

  private getModifiedTasks(): Task[] {
    let modifiedTasks: Task[] = [];
    for (let plannedTask of this.externalEvents) {
      if (plannedTask.taskChanged) {
        modifiedTasks.push(plannedTask.getTask());
      }
    }
    for (let plannedTask of this.events) {
      if (plannedTask.taskChanged) {
        modifiedTasks.push(plannedTask.getTask());
      }
    }
    return modifiedTasks;
  }

  onViewDateChange() {
    this.viewDateChange.next(this.viewDate);
    this.initEvents();
  }

}
