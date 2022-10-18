import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NflComponent } from './nfl/nfl.component';
import { RegisterComponent } from './register/register.component';
import { TeamComponent } from './team/team.component';
import { UclComponent } from './ucl/ucl.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'nogomet', component: UclComponent},
  {path: 'nogomet/tim/:teamId', component: TeamComponent},
  {path: 'nfl', component: NflComponent},
  {path: 'nfl/tim/:teamId', component: TeamComponent},
  {path: 'prijava', component: LoginComponent},
  {path: 'registracija', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
