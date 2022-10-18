import { Injectable } from '@angular/core';
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { UsersService } from './users.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private users: User[] = [];
  private user: User = { id: '', admin: false, email: '', password: '' , username: '' };
  private usersEmpty: User[] = [];
  private usernameSubject: BehaviorSubject<string>;
  private usersSubject: BehaviorSubject<User[]>;
  

  constructor(private router: Router, private usersService: UsersService) {
    this.usernameSubject = new BehaviorSubject('');
    this.usersSubject = new BehaviorSubject(this.usersEmpty);

    this.getAllUsers();
  }

  private getAllUsers() {
    this.usersSubject = this.usersService.getUsersSubject();
    this.usersSubject.subscribe(res => {
      this.users = [...res];
    });
  }

  login(username: string, password: string) {
      let user = this.users.find(u => u.username == username && u.password == password);

      if(user != undefined) {
        this.user = { ...user };
        this.usernameSubject.next(this.user.username);
        localStorage.setItem('user', JSON.stringify(this.user));

        this.router.navigate(['']);
      } 
      
      return 'Nesupješna prijava!';
  }

  logout(){
    this.user = { id: '', admin: false, email: '', password: '' , username: '' };
    this.usernameSubject.next('odjavljen');
    localStorage.removeItem('user');

    this.router.navigate(['']);
  }

  getUser() {  
    let userStr = localStorage.getItem('user');

    if(userStr != null) {
      if(this.user.username == '') this.user = JSON.parse(userStr);
    }    

    return { ...this.user };
  }

  getUsernameSubject() {
    return this.usernameSubject;
  }

  authenticated() {
    let isUser: User = this.getUser();

    return isUser.username != '';
  }

}
