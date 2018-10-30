import { Component } from '@angular/core';
import {UserService} from "./services/UserService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService,
              private router: Router) {
  }

  isUserLoggedIn() {
    return this.userService.isUserLoggedIn();
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
