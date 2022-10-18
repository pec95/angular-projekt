import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserDb } from '../models/userDb.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: User[] = [];
  private usersEmpty: User[] = [];
  private usersSubject: BehaviorSubject<User[]>;

  constructor(private http: HttpClient) {
    this.usersSubject = new BehaviorSubject(this.usersEmpty);
    this.allUsers();
  }

  private allUsers() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/users.json')
            .pipe(map(res => {
              let usersObj = Object.create(res);
              for(let key in usersObj) {
                this.users.push({ id: key, ...usersObj[key] });
              }

              return this.users;
            }))
            .subscribe(res => {
              this.usersSubject.next([...res]);
            });
  }

  getUsersSubject() {
    return this.usersSubject;
  }

  getUsers() {
    return this.users;
  }

  addUser(userDb: UserDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/users.json', userDb)
            .subscribe(res => {
              // console.log(res);
              let userIdObj = Object.create(res);
              let userId = userIdObj['name'];
              let user: User = { id: userId, ...userDb }
              this.users.push(user);
              this.usersSubject.next([...this.users]);
            });
  }

}
