import {Task} from "./Task";

export class Project {

  id: string;

  name: string;

  deadline: Date;

  description: string;

  ownerName: string;

  memberNames: string[];

  tasks: Task[];

}
