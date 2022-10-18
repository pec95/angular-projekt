import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  pass: string = '';
  error: string = '';
  userLoggedIn: boolean = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {    
    if(this.authenticationService.authenticated()) this.userLoggedIn = true;
    else this.userLoggedIn = false;
  }

  login() {
    this.error = '';
    let hash = Md5.hashStr(this.pass);
    this.error = this.authenticationService.login(this.username.trim(), hash);
  }

}
