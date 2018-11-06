import {User} from "../model/User";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BASE_URL} from "../Constants";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class UserService {

  private authenticated = false;
  user: User;

  constructor(private httpClient: HttpClient) {}

  register(user: User): Observable<any> {
    let URL: string = BASE_URL + `/user/register`;
    return this.httpClient.post(URL, user, {responseType: 'text'});
  }

  login(user: User) {
    let URL: string = BASE_URL + `/auth/login`;
    const body = new HttpParams()
      .set('username', user.username)
      .set('password', user.password);
    return this.httpClient.post(URL,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        responseType: 'text',
        withCredentials: true
      }
    ).map(() => {
        const loggedInUserURL = BASE_URL + '/user/loggedInUser';
        this.httpClient.get(loggedInUserURL, {withCredentials: true}).subscribe( (loggedInUser: User) => {
          this.user = loggedInUser;
          this.authenticated = true;
        });
      }
    );
  }

  logout(): Observable<any> {
    this.authenticated = false;
    this.user = null;
    const URL: string = BASE_URL + `/auth/logout`;
    return this.httpClient.post(URL, '', {responseType: 'text', withCredentials: true});
  }

  isUserLoggedIn(): boolean {
    return this.authenticated;
  }

  checkIfUsernameExists(username: string) {
    const URL: string = BASE_URL + `/user/checkUserName`;
    const params = new HttpParams().set('username', username);
    return this.httpClient.get(URL, {params: params});
  }

  getAllUser(): Observable<User[]> {
    const URL: string = BASE_URL + `/user`;
    return this.httpClient.get<User[]>(URL, {withCredentials: true});
  }

  getAllUserName(): Observable<string[]> {
    const URL: string = BASE_URL + `/user/all`;
    return this.httpClient.get<string[]>(URL, {withCredentials: true});
  }

  deleteUser(username: string): Observable<any> {
    const URL: string = BASE_URL + `/user/` + username;
    return this.httpClient.delete(URL, {responseType: 'text', withCredentials: true});
  }

  promoteUserToAdmin(username: string): Observable<any> {
    const URL: string = `${BASE_URL}/user/${username}/makeAdmin`;
    return this.httpClient.put(URL, null,{responseType: 'text', withCredentials: true});
  }
  
}
