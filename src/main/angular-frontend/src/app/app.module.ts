import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CalendarModule} from 'angular-calendar';


import {AppComponent} from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from './components/home/home.component';
import {ProjectsComponent} from './components/projects/projects.component';
import {HttpClientModule} from "@angular/common/http";
import {ProjectClient} from "./services/clients/project.client";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProjectDetailsComponent} from './components/project-edit/project-details/project-details.component';
import {AlertComponent} from "./components/alert/alert.component";
import {AlertService} from "./services/alert.service";
import {TaskClient} from "./services/clients/task.client";
import {ProjectPlannerComponent} from './components/project-edit/project-planner/project-planner.component';
import {DailyPlannerComponent} from './components/daily-planner/daily-planner.component';
import {ModalComponent} from "./components/modal/modal.component";
import {ProjectService} from "./services/project.service";
import {ContextMenuModule} from 'ngx-contextmenu';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {UserService} from "./services/user.service";
import {AuthGuard} from "./services/auth-guard.service";
import {PathAllowerService} from "./services/path-allower.service";
import { UsersComponent } from './components/users/users.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import {DatePipe} from "@angular/common";
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ProjectUsersComponent } from './components/project-edit/project-users/project-users.component';
import { ProjectTasksComponent } from './components/project-edit/project-tasks/project-tasks.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId', component: ProjectEditComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: 'details', pathMatch: 'prefix', canActivate: [AuthGuard]},
      {path: 'details', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
      {path: 'tasks', component: ProjectTasksComponent, canActivate: [AuthGuard]},
      {path: 'members', component: ProjectUsersComponent, canActivate: [AuthGuard]},
      {path: 'planner', component: ProjectPlannerComponent, canActivate: [AuthGuard]},
    ]},
  {path: 'day-planner', component: DailyPlannerComponent, canActivate: [AuthGuard]},
  {path: 'day-planner/:dateParam/new', component: TaskEditComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId/task/new', component: TaskEditComponent, canActivate: [AuthGuard]},
  {path: 'tasks/new', component: TaskEditComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId/tasks/:taskId/edit', component: TaskEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    AlertComponent,
    ProjectPlannerComponent,
    DailyPlannerComponent,
    ModalComponent,
    RegisterComponent,
    LoginComponent,
    UsersComponent,
    TaskEditComponent,
    ProjectEditComponent,
    ProjectUsersComponent,
    ProjectTasksComponent
  ],
  imports: [
    BrowserModule,
    ContextMenuModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    CalendarModule.forRoot()
  ],
  providers: [
    AlertService,
    AuthGuard,
    DatePipe,
    PathAllowerService,
    ProjectService,
    ProjectClient,
    TaskClient,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
