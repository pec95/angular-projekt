import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PlayerNfl } from '../models/playerNfl.model';
import { PlayerNflDb } from '../models/playerNflDb.model';
import { TeamNfl } from '../models/teamNfl.model';
import { TeamNflDb } from '../models/teamNflDb.model';
import { Trade } from '../models/trade.model';
import { TradeNfl } from '../models/tradeNfl.model';
import { TradeNflDb } from '../models/tradeNflDb.model';
import { AuthenticationService } from '../services/authentication.service';
import { NflService } from '../services/nfl.service';

@Component({
  selector: 'app-nfl',
  templateUrl: './nfl.component.html',
  styleUrls: ['./nfl.component.css']
})
export class NflComponent implements OnInit, OnDestroy {

  rating: number = 0;

  errorPlayer: string = '';
  successPlayer: string = '';
  errorTeam: string = '';
  successTeam: string = '';

  playerForm: FormGroup;
  teamForm: FormGroup;

  teams: TeamNfl[] = [];
  teams1: TeamNfl[] = [];
  teams2: TeamNfl[] = [];
  teams3: TeamNfl[] = [];
  teamsEmpty: TeamNfl[] = [];
  teamsSubject: BehaviorSubject<TeamNfl[]>;
  subscriptionTeams: Subscription = new Subscription();

  players: PlayerNfl[] = [];
  players1: PlayerNfl[] = [];
  players2: PlayerNfl[] = [];
  players3: PlayerNfl[] = [];
  playersEmpty: PlayerNfl[] = [];
  playersSubject: BehaviorSubject<PlayerNfl[]>;
  subscriptionPlayers: Subscription = new Subscription();

  trades: Trade[] = [];
  tradesNfl: TradeNfl[] = [];
  tradesEmpty: TradeNfl[] = [];
  tradesSubject: BehaviorSubject<TradeNfl[]>;
  subscriptionTrades: Subscription = new Subscription();
  team1Id: string = '';
  team2Id: string = '';
  players1Id: string[] = [];
  players2Id: string[] = [];
  gradeTeam1: number = 0;
  gradeTeam2: number = 0;

  successTrade: string = '';
  errorTrade: string = '';

  userLoggedIn: boolean = false;
  admin: boolean = false;

  constructor(private fb: FormBuilder, private nflService: NflService, private authenticationService: AuthenticationService) {
    this.playerForm = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'age': new FormControl('', [Validators.required, Validators.min(18), Validators.max(45)]),
      'position': new FormControl('', [Validators.required])
    });

    this.teamForm = this.fb.group({
      'teamName': new FormControl('', [Validators.required]),
      'coach': new FormControl('', [Validators.required]),
      'stadium': new FormControl('', [Validators.required]),
      'established': new FormControl('', [Validators.required, Validators.min(0)]),
      'wins': new FormControl('', [Validators.required, Validators.min(0)]),
      'losses': new FormControl('', [Validators.required, Validators.min(0)]),
      'ties': new FormControl('', [Validators.required, Validators.min(0)]),
      'titles': new FormControl('', [Validators.required, Validators.min(0)]),
      'imageUrl': new FormControl('', [Validators.required])
    });

    this.teamsSubject = new BehaviorSubject(this.teamsEmpty);
    this.playersSubject = new BehaviorSubject(this.playersEmpty);
    this.tradesSubject = new BehaviorSubject(this.tradesEmpty);
  }

  ngOnInit(): void {
    if(!this.authenticationService.authenticated())  {
      this.userLoggedIn = false;
    }
    else {
      this.userLoggedIn = true;
      if(this.authenticationService.getUser().admin) this.admin = true;

      this.teamsSubject = this.nflService.getNflTeams();
      this.subscriptionTeams = this.teamsSubject.subscribe(res => {
        this.teams = [...res];

        this.teams.sort((a, b) => {
          if(a.teamName > b.teamName) return 1;
          if(a.teamName < b.teamName) return -1;
          else return 0;
        });

        this.teams1 = this.teams.splice(0, (this.teams.length / 3) + 1);
        this.teams2 = this.teams.splice(0, (this.teams.length / 2) + 1);
        this.teams3 = this.teams.splice(0, this.teams.length);

        this.teams = [...res];

        this.teams.sort((a, b) => {
          if(a.teamName > b.teamName) return 1;
          if(a.teamName < b.teamName) return -1;
          else return 0;
        });

        /*for(let team of this.teams) {
          team.winPercentage = '.' + ((team.wins / 17) * 1000).toFixed(0);
        }*/
      });

      this.playersSubject = this.nflService.getNflPlayers();
      this.subscriptionPlayers = this.playersSubject.subscribe(res => {
        this.players = [...res];

        this.players.sort((a, b) => {
          if(a.position > b.position) return 1;
          if(a.position < b.position) return -1;
          else return 0;
        });

        this.players1 = this.players.splice(0, (this.players.length / 3) + 1);
        this.players2 = this.players.splice(0, (this.players.length / 2) + 1);
        this.players3 = this.players.splice(0, this.players.length);

        this.players = [...res];
      });

      this.tradesSubject = this.nflService.getNflTrades();
      this.subscriptionTrades = this.tradesSubject.subscribe(res => {
        this.tradesNfl = [...res];
      });  
    }
  }

  setRating(numberOfStars: number) {
    let stars = document.getElementsByName('star');

    for(let i = 0; i < 5; i++) {
      stars[i].classList.remove('checked');
    }

    for(let i = 0; i < numberOfStars; i++) {
      stars[i].classList.add('checked');
    }
    
    this.rating = numberOfStars;
  }

  createPlayer() {
    this.errorPlayer = '';
    this.successPlayer = '';

    let name = this.playerForm.controls['name'];
    let age = this.playerForm.controls['age'];
    let position = this.playerForm.controls['position'];
    let teamId = document.getElementsByTagName('select')[2].value;

    if(age.value == null || this.playerForm.invalid || this.rating == 0) {
      this.errorPlayer = 'Greška! Ili niste unijeli sve podatke ili starost nije točna';
    }
    else {
      this.successPlayer = 'Uspješno ste se dodali igrača ' + name.value.trim() + '!';

      let newPlayer = new PlayerNflDb(age.value, name.value.trim(), position.value.trim(), teamId, this.rating);

      this.resetPlayer()

      this.nflService.addNflPlayer(newPlayer);  
    }
  }

  resetPlayer() {
    this.playerForm.reset();
    this.setRating(0);
  }

  createTeam() {
    this.errorTeam = '';
    this.successTeam = '';

    let select = document.getElementsByTagName('select');
    let conference = select[0].value;
    let divison = conference + ' ' + select[1].value;

    let teamName = this.teamForm.controls['teamName'];
    let coach = this.teamForm.controls['coach'];
    let stadium = this.teamForm.controls['stadium'];
    let established = this.teamForm.controls['established'];
    let wins = this.teamForm.controls['wins'];
    let losses = this.teamForm.controls['losses'];
    let ties = this.teamForm.controls['ties'];
    let titles = this.teamForm.controls['titles'];
    let imageUrl = this.teamForm.controls['imageUrl'];

    if(established.value == null || wins.value == null || losses.value == null || ties.value == null ||  titles.value == null || this.teamForm.invalid) {
      this.errorTeam = 'Greška! Niste unijeli sve podatke ili niste unijeli brojeve gdje treba';
    }
    else {
      this.successTeam = 'Uspješno ste se dodali momčad ' + teamName.value.trim() + '!';

      let newTeam = new TeamNflDb(coach.value.trim(), conference, divison, established.value, imageUrl.value.trim(),
                                  losses.value, stadium.value.trim(), titles.value, teamName.value.trim(), ties.value, wins.value);

      this.resetTeam();

      this.nflService.addNflTeam(newTeam);    
    }

  }

  resetTeam() {
    this.teamForm.reset();
  }

  showPlayers1() {
    this.errorTrade = '';
    this.successTrade = '';

    document.getElementById('showPlayers1')?.blur();
    this.team1Id = document.getElementsByTagName('select')[3].value;
  }

  showPlayers2() {
    this.errorTrade = '';
    this.successTrade = '';

    document.getElementById('showPlayers2')?.blur();
    this.team2Id = document.getElementsByTagName('select')[4].value;
  }

  getTradePlayers1(player1Id: string, index: number) {

    if(document.getElementsByName('trade1')[index].classList.length == 2) {
      document.getElementsByName('trade1')[index].classList.add('text-primary');
      this.players1Id.push(player1Id);
    }
    else {
      document.getElementsByName('trade1')[index].classList.remove('text-primary');
      this.players1Id = this.players1Id.filter(p1 => p1 != player1Id);
    }
  }
    
  getTradePlayers2(player2Id: string, index: number) {
    
    if(document.getElementsByName('trade2')[index].classList.length == 2) {
      document.getElementsByName('trade2')[index].classList.add('text-primary');
      this.players2Id.push(player2Id);
    }
    else {
      document.getElementsByName('trade2')[index].classList.remove('text-primary');
      this.players2Id = this.players2Id.filter(p2 => p2 != player2Id);
    }
  }

  trade() {
    this.errorTrade = '';
    this.successTrade = '';
    
    if((this.players1Id.length == 0 && this.players2Id.length == 0) || this.team1Id === this.team2Id) {
      this.errorTrade = 'Niste uopće odabrali igrače ili ste stavili iste timove';
    }
    else {
      let time = new Date();
      let hoursStr = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
      let minStr = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
      let timestamp = hoursStr + ':' + minStr + ' ' + time.getDate() + '.' + (time.getMonth() + 1) + '.' + time.getFullYear() + '.';
      
      let team2ValueGetting: number[] = [];
      let team1ValueGetting: number[] = [];

      for(let player1Id of this.players1Id) {
        let index = this.players.findIndex(p => p.id === player1Id);
        if(index != -1) {
          this.players[index].teamId = this.team2Id;
          team2ValueGetting.push(this.players[index].value);

          let playerDb = new PlayerNflDb(this.players[index].age, this.players[index].name, this.players[index].position, this.team2Id, this.players[index].value);
          this.nflService.editNflPlayer(this.players[index].id, playerDb);
        }
      }
      
      for(let player2Id of this.players2Id) {
        let index = this.players.findIndex(p => p.id === player2Id);
        if(index != -1) {
          this.players[index].teamId = this.team1Id;
          team1ValueGetting.push(this.players[index].value);

          let playerDb = new PlayerNflDb(this.players[index].age, this.players[index].name, this.players[index].position, this.team1Id, this.players[index].value);
          this.nflService.editNflPlayer(this.players[index].id, playerDb);
        }
      }

      this.grades(team1ValueGetting, team2ValueGetting);

      let trade = new TradeNflDb(this.team1Id, this.team2Id, this.players1Id, this.players2Id, timestamp, this.gradeTeam1, this.gradeTeam2);
      this.nflService.addNflTrade(trade);

      this.successTrade = 'Uspješno ste napravili razmjenu!';

      this.team1Id = '';
      this.team2Id = '';
      this.players1Id = [];
      this.players2Id = [];

      this.gradeTeam1 = 0;
      this.gradeTeam2 = 0;
    }
  }

  showTrades() {
    this.trades = [];
    for(let tradeNfl of this.tradesNfl) {
      console.log(tradeNfl)
      let team1 = this.teams.find(t => t.id === tradeNfl.team1Id)?.teamName;
      let team2 = this.teams.find(t => t.id === tradeNfl.team2Id)?.teamName;

      console.log(team1, team2)
      let players1: string[] = [];

      if(tradeNfl.player1Ids == undefined) {
        players1.push('nikog!');
      }
      else { 
        for(let player1Id of tradeNfl.player1Ids) {
          let player1 = this.players.find(p => p.id === player1Id)?.name;
          if(player1 != undefined) {
            players1.push(player1);
          }
        }
      }

      let players2: string[] = [];

      if(tradeNfl.player2Ids == undefined) {
        players2.push('nikog!');
      }
      else {
        for(let player2Id of tradeNfl.player2Ids) {
          let player2 = this.players.find(p => p.id === player2Id)?.name;
          if(player2 != undefined) {
            players2.push(player2);
          }
        }  
      }
      
      if(team1 != undefined && team2 != undefined) {
        let trade = new Trade(team1, team2, players1, players2, tradeNfl.timestamp, tradeNfl.gradeTeam1, tradeNfl.gradeTeam2);
        this.trades.push(trade);
      }
    }
  }

  grades(team1Values: number[], team2Values: number[]) {
    let team1SumGet: number = 0;
    let team1AvgGet: number = 0;
    team1Values.forEach(e => team1SumGet += e);
    if(team1SumGet != 0)  { 
      team1AvgGet = (team1SumGet / team1Values.length);
    }

    let team2SumGet: number = 0;
    let team2AvgGet: number = 0;
    team2Values.forEach(e => team2SumGet += e);
    if(team2SumGet != 0) {
      team2AvgGet = (team2SumGet / team2Values.length);
    }

    if(team1AvgGet > team2AvgGet) {
      this.gradeTeam1 = 5;
      this.gradeTeam2 = 1;
    }
    else if(team2AvgGet > team1AvgGet) {
      this.gradeTeam2 = 5;
      this.gradeTeam1 = 1;
    }
    else {
      this.gradeTeam1 = 3;
      this.gradeTeam2 = 3;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionTeams.unsubscribe();
    this.subscriptionPlayers.unsubscribe();
    this.subscriptionTrades.unsubscribe();
  }

}
