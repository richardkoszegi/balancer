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

  public updateTask(task: Task): Observable<any> {
    return this.httpClient.put(`${BASE_URL}/task/${task.id}`, task, {responseType: "text"});
  }

  public getTasksForDate(date: Date): Observable<Array<Task>> {
    // Because: https://www.w3schools.com/js/js_date_methods.asp
    let url: string = `${BASE_URL}/task/date/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    console.log(url);
    console.log(date);
    return this.httpClient.get<Array<Task>>(url);
  }
}
