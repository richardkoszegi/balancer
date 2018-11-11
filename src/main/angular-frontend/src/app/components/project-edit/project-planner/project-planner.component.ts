import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK} from 'angular-calendar';
import {Subject} from 'rxjs/Subject';
import {colors} from "../../../Constants";
import {Task} from "../../../model/Task";
import {AlertService} from "../../../services/alert.service";
import {ProjectService} from "../../../services/project.service";
import {Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-project-planner',
  templateUrl: './project-planner.component.html',
})
export class ProjectPlannerComponent implements OnInit, OnDestroy {

  view: string = 'month';

  viewDate: Date = new Date();

  @Input() locale: string = 'en';

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  tasks: Task[];

  externalEvents: CalendarEvent[] = [];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  taskSubscription: Subscription;

  constructor(private alertService: AlertService,
              private projectService: ProjectService,
              private userService: UserService) {}

  eventDropped({
                 event,
                 newStart,
                 newEnd
               }: CalendarEventTimesChangedEvent): void {
    let updatedTask = this.tasks.find((task) => task.name === event.title);
    if(this.canUserEditTask(updatedTask)) {
      const externalIndex: number = this.externalEvents.indexOf(event);
      if (externalIndex > -1) {
        this.externalEvents.splice(externalIndex, 1);
        this.events.push(event);
      }
      event.start = newStart;

      updatedTask.plannedDate = newStart;
      this.projectService.updateTask(updatedTask).subscribe(() => this.alertService.success("Task date modified!"));
      if (newEnd) {
        event.end = newEnd;
      }
      this.viewDate = newStart;
    }
  }

  ngOnInit(): void {
    this.tasks = this.projectService.project.tasks;
    this.refreshEvents();
    this.taskSubscription = this.projectService.tasksChanged.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.refreshEvents();
    })
  }

  private refreshEvents() {
    this.events = [];
    this.externalEvents = [];
    for (let task of this.tasks) {
      if (task.plannedDate) {
        let event = <CalendarEvent>{
          title: task.name,
          color: this.canUserEditTask(task)? colors.blue : colors.yellow,
          start: new Date(task.plannedDate),
          draggable: this.canUserEditTask(task)
        };
        this.events.push(event);
      } else {
        let event = <CalendarEvent>{
          title: task.name,
          color: this.canUserEditTask(task)? colors.blue : colors.yellow,
          start: new Date(),
          draggable: this.canUserEditTask(task)
        };
        this.externalEvents.push(event);
      }
    }
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  private canUserEditTask(task: Task): boolean {
    return (this.userService.isUserLoggedIn() && this.userService.user.username === task.assignedUser) || this.isUserOwner();
  }

  isUserOwner(): boolean {
    return this.userService.isUserLoggedIn() && this.projectService.project.ownerName === this.userService.user.username;
  }

}
