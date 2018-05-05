import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Task} from "../model/Task";
import {Observable} from "rxjs/Observable";
import {BASE_URL} from "../Constants";

@Injectable()
export class TaskService {

  constructor(private httpClient: HttpClient) {}

  public createForProject(projectId: string, task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${BASE_URL}/project/${projectId}/tasks`, task);
  }

  public deleteTask(taskId: string): Observable<any> {
    return this.httpClient.delete(`${BASE_URL}/task/${taskId}`, {responseType: "text"});
  }
}
