import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/Project";
import {ProjectDetailsService} from "../../../services/ProjectDetailsService";
import {UserService} from "../../../services/UserService";
import {ProjectService} from "../../../services/ProjectService";
import {AlertService} from "../../../services/AlertService";

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.css']
})
export class ProjectUsersComponent implements OnInit {

  project: Project;

  selectableUsers: string[] = [];
  membersChanged = false;

  constructor(private alertService: AlertService,
              private projectDetailsService: ProjectDetailsService,
              private projectService: ProjectService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.project = this.projectDetailsService.project;
    if(this.project) {
      if (this.isUserOwner()) {
        this.initSelectableUsers();
      }
    }
    this.projectDetailsService.projectChanged.subscribe(() => {
      this.project = this.projectDetailsService.project;
      if (this.isUserOwner()) {
        this.initSelectableUsers();
      }
    });
  }

  private initProject(projectId: string) {
    this.projectDetailsService.initTasks(projectId).subscribe(project => {
      this.project = project;

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
    return this.userService.isUserLoggedIn() && this.project.ownerName === this.userService.user.username;
  }

  addUserToMembers(userName: string) {
    this.removeUserFromSelectableUsers(userName);
    this.project.memberNames.push(userName);
    this.membersChanged = true;
  }

  onUpdateMembers() {
    this.projectService.updateProjectMembers(this.project).subscribe(() => {
      this.initProject(this.project.id);
      this.alertService.success('Members updated!');
    });
  }

  removeUserFromMembers(userName: string) {
    this.project.memberNames.splice(this.project.memberNames.indexOf(userName), 1);
    this.selectableUsers.push(userName);
    this.membersChanged = true;
  }

}
