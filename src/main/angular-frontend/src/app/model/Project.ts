import {Task} from "./Task";

export class Project {

  id: string;

  name: string;

  deadline: Date;

  description: string;

  tasks: Task[];

  constructor(name: string, deadline: Date, description: string) {
    this.name = name;
    this.deadline = deadline;
    this.description = description;
  }
}
