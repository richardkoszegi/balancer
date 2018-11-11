import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../../model/Project";
import {ProjectService} from "../../../services/project.service";
import {UserService} from "../../../services/user.service";
import {AlertService} from "../../../services/alert.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.css']
})
export class ProjectUsersComponent implements OnInit, OnDestroy {

  project: Project;

  selectableUsers: string[] = [];
  membersChanged = false;

  projectSubscription: Subscription;

  constructor(private alertService: AlertService,
              private projectService: ProjectService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.project = this.projectService.project;
    if(this.project) {
      if (this.isUserOwner()) {
        this.initSelectableUsers();
      }
    }
    this.projectSubscription = this.projectService.projectChanged.subscribe(() => {
      this.project = this.projectService.project;
      if (this.isUserOwner()) {
        this.initSelectableUsers();
      }
    });
  }

  private initSelectableUsers() {
    this.userService.getAllUserName().subscribe((userNames: string[]) => {
      this.selectableUsers = userNames;
      for (const userName of this.project.memberNames) {
        this.removeUserFromSelectableUsers(userName);
      }
      this.removeUserFromSelectableUsers(this.project.ownerName);
    })
  }

  private removeUserFromSelectableUsers(user: string) {
    this.selectableUsers.splice(this.selectableUsers.indexOf(user), 1);
  }

  isUserOwner(): boolean {
    return this.projectService.isUserOwner();
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  addUserToMembers(userName: string) {
    this.removeUserFromSelectableUsers(userName);
    this.project.memberNames.push(userName);
    this.membersChanged = true;
  }

  onUpdateMembers() {
    this.projectService.updateMembers().subscribe(() => {
      this.alertService.success('Members updated!');
    });
  }

  removeUserFromMembers(userName: string) {
    this.project.memberNames.splice(this.project.memberNames.indexOf(userName), 1);
    this.selectableUsers.push(userName);
    this.membersChanged = true;
  }

}
