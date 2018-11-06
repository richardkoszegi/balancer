import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEventTimesChangedEvent, DAYS_OF_WEEK} from "angular-calendar";
import {Subject} from "rxjs/Subject";
import {TaskService} from "../../services/TaskService";
import {AlertService} from "../../services/AlertService";
import {Task} from '../../model/Task';
import {Priority} from "../../model/Priority";
import {PlannedTask} from "../../model/PlannedTask";
import {colors} from "../../Constants";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

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

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  tasks: Task[];

  priorities: string[];

  dataChanged = false;

  constructor(private taskService: TaskService,
              private alertService: AlertService,
              private router: Router,
              private datePipe: DatePipe) {
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
    } else {
      const plannedTaskIndex = this.events.findIndex(event => event.id == eventId);
      if (plannedTaskIndex > -1) {
        modifiedTask = this.events[plannedTaskIndex];
      } else {
        return;
      }
    }
    modifiedTask.changeStart(newStart);
    if (newEnd) {
      modifiedTask.changeEnd(newEnd);
    }
    modifiedTask.setStartAndEndDate();
    this.dataChanged = true;
    this.refresh.next();
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

  moveToUnplanned(plannedTask: PlannedTask) {
    plannedTask.makeUnplanned();
    this.events.splice(this.events.indexOf(plannedTask), 1);
    this.externalEvents.push(plannedTask);
    this.dataChanged = true;
    this.refresh.next();
  }

  deleteEvent(plannedTask: PlannedTask) {
    this.taskService.deleteTask(plannedTask.getTask().id).subscribe(() => {
      this.events.splice(this.events.indexOf(plannedTask), 1);
      this.alertService.info("Task deleted!");
      this.refresh.next();
    })
  }

  onTaskComplete(plannedTask: PlannedTask) {
    plannedTask.getTask().completed = true;
    plannedTask.getTask().completionDate = new Date();
    plannedTask.taskChanged = true;
    this.dataChanged = true;
    plannedTask.color = colors.green;
    this.refresh.next();
  }

  onAddTask() {
    this.router.navigate(['day-planner', this.datePipe.transform(this.viewDate, 'yyyy-MM-dd'), 'new']);
  }

}
