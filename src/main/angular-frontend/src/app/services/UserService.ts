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
        this.authenticated = true;
        this.user = user;
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
  
}
