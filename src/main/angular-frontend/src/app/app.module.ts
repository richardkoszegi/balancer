import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/:projectId', component: ProjectDetailsComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [ProjectService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
