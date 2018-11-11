import { Component } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {User} from "./model/User";
import {PathAllowerService} from "./services/path-allower.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService,
              private pathAllowerService: PathAllowerService,
              private router: Router) {
  }

  isUserLoggedIn() {
    return this.userService.isUserLoggedIn();
  }

  getUser(): User {
    return this.userService.user;
  }

  getUserRole(): string {
    return this.userService.user.role.split('_')[1];
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  isRouteAllowed(path: string): boolean {
    return this.pathAllowerService.checkPath(path);
  }

  //Toggle hamburger menu: https://medium.com/@ct7/the-simple-way-to-make-a-mobile-angular-2-bootstrap-navbar-without-jquery-d6b3f67b037b
  isIn = false;   // store state

  toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false;
  }
}
