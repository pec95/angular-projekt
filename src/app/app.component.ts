import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Projekt';

  userUsername: string = '';
  private usernameSubject: BehaviorSubject<string>;
  
  constructor(private authenticationService: AuthenticationService) {
    this.usernameSubject = new BehaviorSubject('');
  }

  ngOnInit(): void {
    this.loggedIn();
  }

  loggedIn() {
    this.userUsername = this.authenticationService.getUser().username;
    this.usernameSubject = this.authenticationService.getUsernameSubject();
    this.usernameSubject.subscribe(res => {
      // console.log(res);
      if(res != '') this.userUsername = res;
    });
  }

  logout() {
    this.authenticationService.logout();
  }

}
