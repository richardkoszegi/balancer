import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/UserService";
import {User} from "../../model/User";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUser().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  getUsers(): User[] {
    if (this.userService.user) {
      return this.users.filter((user: User) => user.username !== this.userService.user.username);
    }
    return [];
  }

}
