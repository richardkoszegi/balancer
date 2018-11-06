import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CalendarModule} from 'angular-calendar';


import {AppComponent} from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from './components/home/home.component';
import {ProjectsComponent} from './components/projects/projects.component';
import {HttpClientModule} from "@angular/common/http";
import {ProjectService} from "./services/ProjectService";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProjectDetailsComponent} from './components/project-details/project-details.component';
import {AlertComponent} from "./components/alert/alert.component";
import {AlertService} from "./services/AlertService";
import {TaskService} from "./services/TaskService";
import {ProjectPlannerComponent} from './components/project-details/project-planner/project-planner.component';
import {DailyPlannerComponent} from './components/daily-planner/daily-planner.component';
import {ModalComponent} from "./components/modal/modal.component";
import {ProjectDetailsService} from "./services/ProjectDetailsService";
import {ContextMenuModule} from 'ngx-contextmenu';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {UserService} from "./services/UserService";
import {AuthGuard} from "./services/auth-guard.service";
import {PathAllowerService} from "./services/path-allower.service";
import { UsersComponent } from './components/users/users.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import {DatePipe} from "@angular/common";


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
  {path: 'day-planner', component: DailyPlannerComponent, canActivate: [AuthGuard]},
  {path: 'day-planner/:dateParam/new', component: TaskEditComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
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
    TaskEditComponent
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
    ProjectDetailsService,
    ProjectService,
    TaskService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
