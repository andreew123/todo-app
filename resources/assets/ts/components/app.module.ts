import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { AppComponent } from './app.component';
import { HomeComponent } from '../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    AuthService,
    TaskService
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }