import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlayerNfl } from '../models/playerNfl.model';
import { PlayerNflDb } from '../models/playerNflDb.model';
import { PlayerUcl } from '../models/playerUcl.model';
import { PlayerUclDb } from '../models/playerUclDb.model';
import { TeamNfl } from '../models/teamNfl.model';
import { TeamUcl } from '../models/teamUcl.model';
import { AuthenticationService } from '../services/authentication.service';
import { NflService } from '../services/nfl.service';
import { UclService } from '../services/ucl.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  successNflPlayer: string = '';
  errorNflPlayer: string = '';
  successUclPlayer: string = '';
  errorUclPlayer: string = '';

  teamNfl: TeamNfl | undefined = undefined;
  teamUcl: TeamUcl | undefined = undefined;
  teamsNfl: TeamNfl[] = [];
  teamsUcl: TeamUcl[] = [];
  playersUcl: PlayerUcl[] = [];
  playersNfl: PlayerNfl[] = [];
  playerEditNfl: PlayerNflDb[] = [];
  playerEditUcl: PlayerUclDb[] = [];
  nflEdits: boolean[] = [];
  uclEdits: boolean[] = [];

  teamsUclEmpty: TeamUcl[] = [];
  teamsUclSubject: BehaviorSubject<TeamUcl[]>;
  subscriptionTeamsUcl: Subscription = new Subscription();

  teamsNflEmpty: TeamNfl[] = [];
  teamsNflSubject: BehaviorSubject<TeamNfl[]>;
  subscriptionTeamsNfl: Subscription = new Subscription();

  playersUclEmpty: PlayerUcl[] = [];
  playersUclSubject: BehaviorSubject<PlayerUcl[]>;
  subscriptionPlayersUcl: Subscription = new Subscription();

  playersNflEmpty: PlayerNfl[] = [];
  playersNflSubject: BehaviorSubject<PlayerNfl[]>;
  subscriptionPlayersNfl: Subscription = new Subscription();

  userLoggedIn: boolean = false;
  admin: boolean = false;

  editText: string[] = [];
  

  constructor(private router: Router, private uclService: UclService, private nflService: NflService, private authenticationService: AuthenticationService) {
    this.teamsUclSubject = new BehaviorSubject(this.teamsUclEmpty);
    this.teamsNflSubject = new BehaviorSubject(this.teamsNflEmpty);
    this.playersUclSubject = new BehaviorSubject(this.playersUclEmpty);
    this.playersNflSubject = new BehaviorSubject(this.playersNflEmpty);
  }

  ngOnInit(): void {
    if(!this.authenticationService.authenticated())  {
      this.userLoggedIn = false;
    }
    else {
      this.userLoggedIn = true;
      if(this.authenticationService.getUser().admin) this.admin = true;

      let teamId = '';
      let teamIdStr = '';

      teamIdStr = this.router.url;
      teamId = teamIdStr.substr(teamIdStr.indexOf('-'));

      this.teamsUclSubject = this.uclService.getUclTeams();
      this.subscriptionTeamsUcl = this.teamsUclSubject.subscribe(res => {
        this.teamsUcl = [...res];

        this.teamUcl = this.teamsUcl.find(u => u.id == teamId);

        if(this.teamUcl != undefined) {
          this.playersUclSubject = this.uclService.getUclPlayers();
          this.subscriptionPlayersUcl = this.playersUclSubject.subscribe(res => {
            this.playersUcl = [...res];

            this.playersUcl = this.playersUcl.filter(pu => pu.teamId == teamId);

            for(let i = 0; i < this.playersUcl.length; i++) {
              this.playerEditUcl[i] = { age: this.playersUcl[i].age, name: this.playersUcl[i].name, position: this.playersUcl[i].position, teamId: this.playersUcl[i].teamId };
              this.uclEdits[i] = false;
              this.editText[i] = 'Uredi';
            }
          });
        }
      });

      this.teamsNflSubject = this.nflService.getNflTeams();
      this.subscriptionTeamsNfl = this.teamsNflSubject.subscribe(res => {
        this.teamsNfl = [...res];

        this.teamNfl = this.teamsNfl.find(n => n.id == teamId);

        if(this.teamNfl != undefined) {
          this.playersNflSubject = this.nflService.getNflPlayers();
          this.subscriptionPlayersNfl = this.playersNflSubject.subscribe(res => {
            this.playersNfl = [...res];

            this.playersNfl = this.playersNfl.filter(pn => pn.teamId == teamId);

            for(let i = 0; i < this.playersNfl.length; i++) {
              this.playerEditNfl[i] = { age: this.playersNfl[i].age, name: this.playersNfl[i].name, position: this.playersNfl[i].position,
                                        teamId: this.playersNfl[i].teamId, value: this.playersNfl[i].value };
              this.nflEdits[i] = false;
              this.editText[i] = 'Uredi';
            }
          });
        }
      });
    }
  }

  deleteNflTeam(id: string) {
    this.nflService.deleteNflTeam(id);
  }

  editNflPlayer(id: string, index: number) {  
      this.errorNflPlayer = '';
      this.successNflPlayer = '';
      
      if(this.playerEditNfl[index].name != '' && this.playerEditNfl[index].age != null && this.playerEditNfl[index].age >= 18 
         && this.playerEditNfl[index].age <= 45 && this.playerEditNfl[index].position != '' && this.playerEditNfl[index].value != null
         && this.playerEditNfl[index].value > 0 && this.playerEditNfl[index].value < 6) {
        let playerEditNflDb = new PlayerNflDb(this.playerEditNfl[index].age, this.playerEditNfl[index].name,
                                              this.playerEditNfl[index].position, this.playersNfl[index].teamId, this.playerEditNfl[index].value);
        this.playerEditNfl[index] = { age: 0, name: '', position: '', teamId: '', value: 0 };
        this.successNflPlayer = 'Uspješno ste uredili igrača ' + playerEditNflDb.name;
        this.editText[index] = 'Uredi';
        this.nflEdits[index] = false;
        this.nflService.editNflPlayer(id, playerEditNflDb);
      }
      else {
        this.errorNflPlayer = 'Greška! Ili niste unijeli sve podatke ili starost ili vrijednost nisu točni';
      }
    
  }

  deleteNflPlayer(id: string) {
    this.errorNflPlayer = '';
    this.successNflPlayer = '';

    this.nflService.deleteNflPlayer(id);
  }

  deleteUclTeam(id: string) {
    this.uclService.deleteUclTeam(id);
  }

  editUclPlayer(id: string, index: number) {
    this.errorUclPlayer = '';
    this.successUclPlayer = '';

    if(this.playerEditUcl[index].name != '' && this.playerEditUcl[index].age != null && this.playerEditUcl[index].age >= 18 
      && this.playerEditUcl[index].age <= 45 && this.playerEditUcl[index].position != '') {
        let playerEditUclDb = new PlayerUclDb(this.playerEditUcl[index].age, this.playerEditUcl[index].name, this.playerEditUcl[index].position, this.playersUcl[index].teamId);
        this.playerEditUcl[index] = { age: 0, name: '', position: '', teamId: '' };        
        this.successUclPlayer = 'Uspješno ste uredili igrača ' + playerEditUclDb.name;
        this.uclEdits[index] = false;
        this.editText[index] = 'Uredi';
        this.uclService.editUclPlayer(id, playerEditUclDb);
    }
    else {
      this.errorUclPlayer = 'Greška! Ili niste unijeli sve podatke ili starost nije točna';
    }    
  }

  deleteUclPlayer(id: string) {
    this.errorUclPlayer = '';
    this.successUclPlayer = '';
    
    this.uclService.deleteUclPlayer(id);
  }

  resetUcl(index: number) {
    this.errorUclPlayer = '';
    this.successUclPlayer = '';

    if(this.uclEdits[index] == false) {    
      this.uclEdits[index] = true;
      for(let i = 0; i < this.uclEdits.length; i++) {
        if(i != index && this.uclEdits[i] != false) this.uclEdits[i] = false;
      }

      this.editText[index] = 'Odustani';
      for(let i = 0; i < this.editText.length; i++) {
        if(i != index && this.editText[i] != 'Uredi') this.editText[i] = 'Uredi';
      }
      document.getElementsByName('resetUcl')[index].blur();
    }
    else {
      this.uclEdits[index] = false;
      this.editText[index] = 'Uredi';
      document.getElementsByName('resetUcl')[index].blur();

      this.playerEditUcl[index].age = this.playersUcl[index].age;
      this.playerEditUcl[index].name = this.playersUcl[index].name;
      this.playerEditUcl[index].position = this.playersUcl[index].position;
      this.playerEditUcl[index].teamId = this.playersUcl[index].teamId;
    }
  }

  resetNfl(index: number) {
    this.errorNflPlayer = '';
    this.successNflPlayer = '';

    if(this.nflEdits[index] == false) {
      this.nflEdits[index] = true;
      for(let i = 0; i < this.nflEdits.length; i++) {
        if(i != index && this.uclEdits[i] != false) this.nflEdits[i] = false;
      }

      this.editText[index] = 'Odustani';
      for(let i = 0; i < this.editText.length; i++) {
        if(i != index && this.editText[i] != 'Uredi') this.editText[i] = 'Uredi';
      }

      document.getElementsByName('resetNfl')[index].blur();
    }
    else {
      this.nflEdits[index] = false;
      this.editText[index] = 'Uredi';
      document.getElementsByName('resetNfl')[index].blur();
      
      this.playerEditNfl[index].age = this.playersNfl[index].age;
      this.playerEditNfl[index].name = this.playersNfl[index].name;
      this.playerEditNfl[index].position = this.playersNfl[index].position;
      this.playerEditNfl[index].teamId = this.playersNfl[index].teamId;
      this.playerEditNfl[index].value = this.playersNfl[index].value;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionTeamsUcl.unsubscribe();
    this.subscriptionTeamsNfl.unsubscribe();
    this.subscriptionPlayersUcl.unsubscribe();
    this.subscriptionPlayersNfl.unsubscribe();
  }
}
