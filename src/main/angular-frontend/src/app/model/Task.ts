import {Priority} from "./Priority";

export class Task {

  id: string;

  name: string;

  plannedDate: Date;

  completionDate: Date;

  completed: boolean = false;

  description: string;

  priority: Priority;

  subTasks: Task[];

  assignedToDate: boolean = false;

  estimatedTime: number;
}
