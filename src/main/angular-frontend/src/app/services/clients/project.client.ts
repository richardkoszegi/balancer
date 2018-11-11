import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Project} from "../../model/Project";
import {BASE_URL} from "../../Constants";

//source: http://brianflove.com/2017/07/21/migrating-to-http-client/
@Injectable()
export class ProjectClient{

  private readonly URL = BASE_URL + "/project";

  constructor(private httpClient: HttpClient) {}

  public list(): Observable<Array<Project>> {
    return this.httpClient.get<Array<Project>>(this.URL, {withCredentials: true});
  }

  public create(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.URL, project, {withCredentials: true});
  }

  public delete(project: Project): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${project.id}`, {responseType: "text", withCredentials: true});
  }

  public getProject(projectId: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.URL}/${projectId}`, {withCredentials: true});
  }

  public modifyProject(project: Project): Observable<any> {
    return this.httpClient.put(`${this.URL}/`, project, {responseType: "text", withCredentials: true});
  }

  public updateProjectMembers(project: Project): Observable<any> {
    return this.httpClient.put(`${this.URL}/${project.id}/members`, project.memberNames, {responseType: "text", withCredentials: true});
  }
}
