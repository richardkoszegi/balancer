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
import {NewTaskModalComponent} from './components/project-details/new-task-modal/new-task-modal.component';
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
import {NewDayTaskModalComponent} from "./components/daily-planner/new-day-task-modal/new-day-task-modal.component";


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
  {path: 'day-planner', component: DailyPlannerComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    AlertComponent,
    NewDayTaskModalComponent,
    NewTaskModalComponent,
    ProjectPlannerComponent,
    DailyPlannerComponent,
    ModalComponent,
    RegisterComponent,
    LoginComponent
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
    ProjectDetailsService,
    ProjectService,
    TaskService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
