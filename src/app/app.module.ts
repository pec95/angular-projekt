import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UclComponent } from './ucl/ucl.component';
import { NflComponent } from './nfl/nfl.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TeamComponent } from './team/team.component';
import { HttpClientModule } from '@angular/common/http';
import { SortPipe } from './pipes/sort.pipe';
import { FilterStringPipe } from './pipes/filter-string.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UclComponent,
    NflComponent,
    LoginComponent,
    RegisterComponent,
    TeamComponent,
    SortPipe,
    FilterStringPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
