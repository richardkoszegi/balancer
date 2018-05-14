import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent} from "angular-calendar";
import {Subject} from "rxjs/Subject";
import {TaskService} from "../../services/TaskService";
import {colors} from "../../Constants";
import {AlertService} from "../../services/AlertService";
import {Task} from '../../model/Task';

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

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  tasks: Task[];

  constructor(private taskService: TaskService, private alertService: AlertService) { }

  ngOnInit() {
    this.initEvents();
  }

  initEvents() {
    this.events = [];
    this.externalEvents = [];
    this.taskService.getTasksForDate(this.viewDate).subscribe( tasks => {
      this.tasks = tasks;
      for(let task of tasks) {
        if(task.assignedToDate) {
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
      this.refresh.next();
    })
  }

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
    updatedTask.assignedToDate = true;
    if (newEnd) {
      event.end = newEnd;
    }
    this.taskService.updateTask(updatedTask).subscribe(data => {
      this.alertService.success("Task date modified!");
      this.refresh.next();
    });
  }

  onViewDateChange() {
    this.viewDateChange.next(this.viewDate);
    this.initEvents();
  }

}
