import {CalendarEvent} from "angular-calendar";
import {Task} from "./Task";
import {colors} from "../Constants";
import {Priority} from "./Priority";

export class PlannedTask implements CalendarEvent {
  allDay: boolean;
  color: { primary: string, secondary: string };
  cssClass: string;
  draggable: boolean;
  end: Date;
  id: string;
  resizable: { beforeStart?: boolean; afterEnd?: boolean };
  start: Date;
  title: string;

  taskChanged = false;

  estimatedDate: string;

  private task: Task;

  constructor(task: Task) {
    this.task = task;
    this.title = task.name;
    this.id = task.id;
    this.color = colors.blue;

    if(task.estimatedTime) {
      const hours = Math.floor(task.estimatedTime / 60);
      const minutes = task.estimatedTime%60;
      this.estimatedDate = hours + ':' + minutes;
    }
  }

  setStartAndEndDate(): void {
    this.start = new Date(this.task.plannedDate);
    this.end = new Date(this.task.plannedDate);
    if (this.task.estimatedTime) {
      this.end.setHours(this.end.getHours() + Math.floor(this.task.estimatedTime / 60));
      this.end.setMinutes(this.end.getMinutes() + this.task.estimatedTime % 60);
    } else {
      this.end.setHours(this.end.getHours() + 1);
    }
    if (this.start.getDate() != this.end.getDate()) {
      this.end.setDate(this.start.getDate());
      this.end.setHours(23);
      this.end.setMinutes(59);
    }
  }

  get estimatedTime(): string {
    return this.estimatedDate;
  }

  set estimatedTime(date: string) {
    this.taskChanged = true;
    this.estimatedDate = date;
    this.updateTaskEstimatedTime(date);
  }

  private updateTaskEstimatedTime(dateString: string) {
    let newEstimatedTime = 0;
    const splitDate = dateString.split(':');
    newEstimatedTime += +splitDate[0] * 60;
    newEstimatedTime += +splitDate[1];
    this.task.estimatedTime = newEstimatedTime;
  }

  get priority(): Priority {
    return this.task.priority;
  }

  set priority(priority: Priority) {
    this.taskChanged = true;
    this.task.priority = priority;
  }

  changeStart(newStart: Date) {
    this.start = newStart;
    this.task.plannedDate = newStart;
    this.task.assignedToDate = true;
  }

}
