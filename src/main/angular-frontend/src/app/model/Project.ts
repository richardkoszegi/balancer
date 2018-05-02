import {Task} from "./Task";

export class Project {

  id: string;

  name: string;

  deadline: Date;

  description: string;

  tasks: Task[];

  public copyInto(data) {
    this.id = data.id;
    this.name = data.name;
    this.deadline = data.deadline;
    this.description = data.description;
    this.tasks = data.tasks;
  }
}
