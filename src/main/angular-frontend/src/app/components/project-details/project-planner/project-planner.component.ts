import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {Subject} from 'rxjs/Subject';
import {colors} from "../../../Constants";
import {Task} from "../../../model/Task";
import {TaskService} from "../../../services/TaskService";
import {AlertService} from "../../../services/AlertService";

@Component({
  selector: 'app-project-planner',
  templateUrl: './project-planner.component.html',
  // styleUrls: ['../../../../node_modules/angular-calendar/css/angular-calendar.css']
})
export class ProjectPlannerComponent implements OnInit {

  view: string = 'month';

  viewDate: Date = new Date();

  @Input() locale: string = 'en';

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  @Input()
  tasks: Task[];

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  constructor(private taskService: TaskService, private alertService: AlertService) {}

  eventDropped({
                 event,
                 newStart,
                 newEnd
               }: CalendarEventTimesChangedEvent): void {
    const externalIndex: number = this.externalEvents.indexOf(event);
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    let updatedTask = this.tasks.find((task) => task.name === event.title);
    updatedTask.plannedDate = newStart;
    this.taskService.updateTask(updatedTask).subscribe(data => this.alertService.success("Task date modified!"));
    if (newEnd) {
      event.end = newEnd;
    }
    this.viewDate = newStart;
  }

  ngOnInit(): void {
    for (let task of this.tasks) {
      if (task.plannedDate != null) {
        let event = <CalendarEvent>{
          title: task.name,
          color: colors.blue,
          start: new Date(task.plannedDate),
          draggable: true
        };
        this.events.push(event);
      } else {
        let event = <CalendarEvent>{
          title: task.name,
          color: colors.blue,
          start: new Date(),
          draggable: true
        };
        this.externalEvents.push(event);
      }
    }
  }

  addNewTask(task: Task) {
    let event = <CalendarEvent>{
      title: task.name,
      color: colors.blue,
      start: new Date(task.plannedDate),
      draggable: true
    };
    if(task.plannedDate == null) {
      this.externalEvents.push(event);
    } else {
      console.log(event);
      this.events.push(event);
      this.refresh.next();
    }
  }

  deleteTask(task: Task) {
    if(task.plannedDate != null) {
      this.events = this.events.filter( event => event.title != task.name);
      this.refresh.next();
    } else {
      this.externalEvents = this.externalEvents.filter( event => event.title != task.name);
    }
  }

}
