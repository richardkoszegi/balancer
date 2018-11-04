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

  estimatedTimeInput: string;

  private task: Task;

  constructor(task: Task) {
    this.task = task;
    this.title = task.name;
    this.id = task.id;

    if (task.completed) {
      this.color = colors.green;
    } else {
      this.color = colors.blue;
    }

    this.resizable = { beforeStart: true, afterEnd: true };
    this.draggable = true;

    this.initEstimatedTimeInput();
  }
  
  private initEstimatedTimeInput() {
    if(this.task.estimatedTime) {
      const hours = Math.floor(this.task.estimatedTime / 60);
      const minutes = this.task.estimatedTime%60;
      if (hours < 10) {
        this.estimatedTimeInput = "0";
      } else {
        this.estimatedTimeInput = "";
      }
      this.estimatedTimeInput += hours + ':';
      if (minutes < 10) {
        this.estimatedTimeInput += '0';
      }
      this.estimatedTime += minutes;
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
    return this.estimatedTimeInput;
  }

  set estimatedTime(date: string) {
    this.taskChanged = true;
    this.estimatedTimeInput = date;
    this.updateTaskEstimatedTime(date);
  }

  private updateTaskEstimatedTime(dateString: string) {
    this.task.estimatedTime = PlannedTask.convertEstimatedTime(dateString);
  }

  static convertEstimatedTime(dateString: string): number {
    let newEstimatedTime = 0;
    const splitDate = dateString.split(':');
    newEstimatedTime += +splitDate[0] * 60;
    newEstimatedTime += +splitDate[1];
    return newEstimatedTime;
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
    this.taskChanged = true;
  }

  changeEnd(newEnd: Date) {
    this.end = newEnd;
    // Two times difference in typescript: https://stackoverflow.com/a/14980102
    let difference = newEnd.getTime()-this.start.getTime();
    // The result is in milliseconds: https://stackoverflow.com/a/7763335
    const hours = Math.floor(difference / (60*60*1000));
    const minutes = Math.floor((difference % (60*60*1000)) / (60 * 1000));
    this.task.estimatedTime = hours * 60 + minutes;
    this.taskChanged = true;
  }

  getTask(): Task {
    return this.task;
  }

  makeUnplanned() {
    this.task.assignedToDate = false;
    this.taskChanged = true;
  }

}
