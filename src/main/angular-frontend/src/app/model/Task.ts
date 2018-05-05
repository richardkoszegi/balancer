export class Task {

  id: string;

  name: string;

  plannedDate: Date;

  completionDate: Date;

  completed: boolean;

  description: string;

  priority: string;

  subTasks: Task[];

  copyFrom(data) {
    this.id = data.id;
    this.name = data.name;
    this.plannedDate = data.plannedDate;
    this.completionDate = data.completionDate;
    this.completed = data.completed;
    this.description = data.description;
    this.priority = data.priority;
    this.subTasks = data.subTasks;
  }
}
