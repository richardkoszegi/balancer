import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'angular-calendar';


import { AppComponent } from './app.component';
import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import {HttpClientModule} from "@angular/common/http";
import {ProjectService} from "./services/ProjectService";
import {FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import {AlertComponent} from "./components/alert/alert.component";
import {AlertService} from "./services/AlertService";
import { NewTaskModalComponent } from './components/new-task-modal/new-task-modal.component';
import {TaskService} from "./services/TaskService";
import { ProjectPlannerComponent } from './components/project-planner/project-planner.component';
import { DailyPlannerComponent } from './components/daily-planner/daily-planner.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/:projectId', component: ProjectDetailsComponent},
  {path: 'day-planner', component: DailyPlannerComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    AlertComponent,
    NewTaskModalComponent,
    ProjectPlannerComponent,
    DailyPlannerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    CalendarModule.forRoot()
  ],
  providers: [ProjectService, AlertService, TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
