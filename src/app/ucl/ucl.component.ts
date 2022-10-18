import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { PlayerUcl } from '../models/playerUcl.model';
import { PlayerUclDb } from '../models/playerUclDb.model';
import { TeamUcl } from '../models/teamUcl.model';
import { TeamUclDb } from '../models/teamUclDb.model';
import { Transfer } from '../models/transfer.model';
import { TransferUcl } from '../models/transferUcl.model';
import { TransferUclDb } from '../models/transferUclDb.model';
import { AuthenticationService } from '../services/authentication.service';
import { UclService } from '../services/ucl.service';

@Component({
  selector: 'app-ucl',
  templateUrl: './ucl.component.html',
  styleUrls: ['./ucl.component.css']
})
export class UclComponent implements OnInit, OnDestroy {

  errorPlayer: string = '';
  successPlayer: string = '';
  errorTeam: string = '';
  successTeam: string = '';

  playerForm: FormGroup;
  teamForm: FormGroup;

  teams: TeamUcl[] = [];
  teams1: TeamUcl[] = [];
  teams2: TeamUcl[] = [];
  teams3: TeamUcl[] = [];
  teamsEmpty: TeamUcl[] = [];
  teamsSubject: BehaviorSubject<TeamUcl[]>;
  subscriptionTeams: Subscription = new Subscription();

  players: PlayerUcl[] = [];
  players1: PlayerUcl[] = [];
  players2: PlayerUcl[] = [];
  players3: PlayerUcl[] = [];
  playersEmpty: PlayerUcl[] = [];
  playersSubject: BehaviorSubject<PlayerUcl[]>;
  subscriptionPlayers: Subscription = new Subscription();

  transfersUcl: TransferUcl[] = [];
  transfers: Transfer[] = [];
  transfersEmpty: TransferUcl[] = [];
  transfersSubject: BehaviorSubject<TransferUcl[]>;
  subscriptionTransfers: Subscription = new Subscription();
  valueTransfer: number = 0;
  outgoingTeamId: string = '';
  playersTransfer: PlayerUcl[] = [];
  playerIndex: number = -1;
  playerSelectedIndex: number = -1;

  errorTransfer: string = '';
  successTransfer: string = '';
  
  userLoggedIn: boolean = false;
  admin: boolean = false;
  

  constructor(private fb: FormBuilder, private uclService: UclService, private authenticationService: AuthenticationService) { 
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
      'imageUrl': new FormControl('', [Validators.required])
    });

    this.teamsSubject = new BehaviorSubject(this.teamsEmpty);
    this.playersSubject = new BehaviorSubject(this.playersEmpty);
    this.transfersSubject = new BehaviorSubject(this.transfersEmpty);
  }

  ngOnInit(): void {
    if(!this.authenticationService.authenticated())  {
      this.userLoggedIn = false;
    }
    else {
      this.userLoggedIn = true;
      if(this.authenticationService.getUser().admin) this.admin = true;

      this.teamsSubject = this.uclService.getUclTeams();
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
      });

      this.playersSubject = this.uclService.getUclPlayers();
      this.subscriptionPlayers = this.playersSubject.subscribe(res => {
        this.players = [...res];

        this.players.sort((a, b) => {
          if(a.name > b.name) return 1;
          if(a.name < b.name) return -1;
          else return 0;
        });

        this.players1 = this.players.splice(0, (this.players.length / 3) + 1);
        this.players2 = this.players.splice(0, (this.players.length / 2) + 1);
        this.players3 = this.players.splice(0, this.players.length);

        this.players = [...res];
      });

      this.transfersSubject = this.uclService.getUclTransfers();
      this.subscriptionTransfers = this.transfersSubject.subscribe(res => {
        this.transfersUcl = [...res];
      });
    }  
  }

  createPlayer() {
    this.errorPlayer = '';
    this.successPlayer = '';

    let name = this.playerForm.controls['name'];
    let age = this.playerForm.controls['age'];
    let position = this.playerForm.controls['position'];

    let select = document.getElementsByTagName('select');
    let teamId = select[0].value;

    if(age.value == null || this.playerForm.invalid) {
      this.errorPlayer = 'Greška! Ili niste unijeli sve podatke ili starost nije točna';
    }
    else {
      this.successPlayer = 'Uspješno ste se dodali igrača ' + name.value.trim() + '!';

      let newPlayer = new PlayerUclDb(age.value, name.value.trim(), position.value.trim(), teamId);

      this.resetPlayer();

      this.uclService.addUclPlayer(newPlayer);    
    }
  }

  resetPlayer() {
    this.playerForm.reset();
  }

  createTeam() {
    this.errorTeam = '';
    this.successTeam = '';

    let teamName = this.teamForm.controls['teamName'];
    let coach = this.teamForm.controls['coach'];
    let stadium = this.teamForm.controls['stadium'];
    let established = this.teamForm.controls['established'];
    let imageUrl = this.teamForm.controls['imageUrl'];

    if(established.value == null || this.teamForm.invalid) {
      this.errorTeam = 'Greška! Niste unijeli sve podatke ili niste unijeli brojeve gdje treba';
    }
    else {
      this.successTeam = 'Uspješno ste se dodali momčad ' + teamName.value.trim() + '!';

      let newTeam = new TeamUclDb(coach.value.trim(), established.value, imageUrl.value.trim(), stadium.value.trim(), teamName.value.trim());

      this.resetTeam();

      this.uclService.addUclTeam(newTeam);    
    }

  }

  resetTeam() {
    this.teamForm.reset();
  }

  showPlayers() {
    this.errorTransfer = '';
    this.successTransfer = '';

    document.getElementById('showPlayers')?.blur();
    this.outgoingTeamId = document.getElementsByTagName('select')[1].value;
    
    this.playersTransfer = this.players.filter(p => p.teamId == this.outgoingTeamId);

    this.valueTransfer = 0;
    this.playerIndex = -1;
  }

  getTransferPlayer(playerId: string, index: number) {
    this.playerIndex = this.players.findIndex(p => p.id == playerId);
    this.playerSelectedIndex = index;

    for(let i = 0; i < this.playersTransfer.length; i++) {
      if(i == index) document.getElementsByTagName('i')[index].classList.add('text-primary');
      else document.getElementsByTagName('i')[i].classList.remove('text-primary');
    }
  }

  transfer() {
    this.errorTransfer = '';
    this.successTransfer = '';

    let incomingTeamId = document.getElementsByTagName('select')[2].value;
    
    if(this.valueTransfer == null || incomingTeamId === this.outgoingTeamId) {
      this.errorTransfer = 'Niste unijeli dobru vrijednost transfera ili ste stavili iste klubove';
    }
    else {
      let time = new Date();
      let hoursStr = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
      let minStr = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
      let timestamp = hoursStr + ':' + minStr + ' ' + time.getDate() + '.' + (time.getMonth() + 1) + '.' + time.getFullYear() + '.';
      
      let indexTransfer = this.playersTransfer.findIndex(p => p.id == this.players[this.playerIndex].id);
      this.playersTransfer.splice(indexTransfer, 1);
      
      if(incomingTeamId == '' || this.outgoingTeamId == '') {
        this.valueTransfer = 0;
      }
      let transfer = new TransferUclDb(incomingTeamId, this.outgoingTeamId, this.players[this.playerIndex].id, timestamp, this.valueTransfer);
      this.uclService.addUclTransfer(transfer);

      this.players[this.playerIndex].teamId = incomingTeamId;
      let playerDb = new PlayerUclDb(this.players[this.playerIndex ].age, this.players[this.playerIndex].name, this.players[this.playerIndex].position, incomingTeamId);
      this.uclService.editUclPlayer(this.players[this.playerIndex].id, playerDb);

      this.successTransfer = 'Uspješno ste napravili transfer!';

      this.valueTransfer = 0;
      this.playerIndex = -1;
    }
  }

  showTransfers() {
    this.transfers = [];
    for(let transferUcl of this.transfersUcl) {
      let player  = this.players.find(p => p.id == transferUcl.playerId)?.name;

      let outgoing: string | undefined = '';
      if(transferUcl.outgoingId == '') {
        outgoing = 'slobodan igrač';
      }
      else {
        outgoing = this.teams.find(t => t.id == transferUcl.outgoingId)?.teamName;
      }

      let incoming: string | undefined = '';
      if(transferUcl.incomingId == '') {
        incoming = 'slobodan igrač';
      }
      else {
        incoming = this.teams.find(t => t.id == transferUcl.incomingId)?.teamName;
      }
      
      if(player != undefined && outgoing != undefined && incoming != undefined) {
        let transfer = new Transfer(incoming, outgoing, player, transferUcl.timestamp, transferUcl.valueInMillions);

        this.transfers.push(transfer);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptionTeams.unsubscribe();
    this.subscriptionPlayers.unsubscribe();
    this.subscriptionTransfers.unsubscribe();
  }

}
