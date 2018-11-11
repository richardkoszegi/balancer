import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../model/User";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private alertService: AlertService,
              private userService: UserService) {
  }

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

  deleteUser(user: User) {
    this.userService.deleteUser(user.username).subscribe(() => {
      this.users.splice(this.users.indexOf(user));
      this.alertService.success(`${user.username} user deleted`);
    });
  }

  promoteUserToAdmin(user: User) {
    this.userService.promoteUserToAdmin(user.username).subscribe(() => {
      user.role = 'ROLE_ADMIN';
      this.alertService.success(`${user.username} promoted to admin!`);
    })
  }

}
