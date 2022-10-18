import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user.model';
import { UserDb } from '../models/userDb.model';
import { UsersService } from '../services/users.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userLoggedIn: boolean = false;

  form: FormGroup;

  users: User[] = [];
  usersEmpty: User[] = [];

  errors: string[] = [];
  success = '';

  constructor(private usersService: UsersService, private fb: FormBuilder, private authenticationService: AuthenticationService) { 
    this.form = this.fb.group({
      'username': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'pass1': new FormControl('', [Validators.required]),
      'pass2': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {
    if(this.authenticationService.authenticated()) this.userLoggedIn = true;
    else this.userLoggedIn = false;

    this.users = this.usersService.getUsers();
  }

  register() {
    this.errors = [];
    this.success = '';

    let usernameTaken = false;

    let username = this.form.controls['username'];
    let pass = this.form.controls['pass1'];
    let pass2 = this.form.controls['pass2'];
    let email = this.form.controls['email'];

    for(let i = 0; i < this.users.length; i++) {
      if(this.users[i].username === username.value) {
        usernameTaken = true;
        break;
      }
    }

    if(username.value.length <= 3) {
      this.errors.push('Korisničko ime mora biti veće od 3 znaka');
    }
    if(usernameTaken) {
      this.errors.push('Korisničko ime već postoji');
    }
    if(!(pass.value === pass2.value)) {
      this.errors.push('Lozinke nisu iste');
    }
    if(email.dirty && email.invalid) {
      this.errors.push('E-mail nije ispravan');
    }
    if(username.invalid || pass.invalid || pass2.invalid || (!email.dirty && email.invalid)) {
      this.errors.push('Sva polja nisu ispunjena');
    }
    
    if(this.errors.length == 0) {
      let hash = Md5.hashStr(pass.value);

      this.success = 'Uspješno ste se registrirali! Sada se prijavite u aplikaciju.';
      let newUser = new UserDb(false, email.value.trim(), hash, username.value.trim());

      this.usersService.addUser(newUser);      
    }
  }

}
