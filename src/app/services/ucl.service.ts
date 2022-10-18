import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TeamUclDb } from '../models/teamUclDb.model';
import { TeamUcl } from '../models/teamUcl.model';
import { PlayerUcl } from '../models/playerUcl.model';
import { TransferUcl } from '../models/transferUcl.model';
import { PlayerUclDb } from '../models/playerUclDb.model';
import { TransferUclDb } from '../models/transferUclDb.model';

@Injectable({
  providedIn: 'root'
})
export class UclService {
  uclTeams: TeamUcl[] = [];
  uclTeamsEmpty: TeamUcl[] = [];
  uclTeamsSubject: BehaviorSubject<TeamUcl[]>;

  uclPlayers: PlayerUcl[] = [];
  uclPlayersEmpty: PlayerUcl[] = [];
  uclPlayersSubject: BehaviorSubject<PlayerUcl[]>;

  uclTransfers: TransferUcl[] = [];
  uclTransfersEmpty: TransferUcl[] = [];
  uclTransfersSubject: BehaviorSubject<TransferUcl[]>;

  constructor(private http: HttpClient) {
    this.uclTeamsSubject = new BehaviorSubject(this.uclTeamsEmpty);
    this.allUclTeams();

    this.uclPlayersSubject = new BehaviorSubject(this.uclPlayersEmpty);
    this.allUclPlayers();

    this.uclTransfersSubject = new BehaviorSubject(this.uclTransfersEmpty);
    this.allUclTransfers();
  }

  private allUclTeams() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/teams.json')
            .pipe(map(res => {
              let uclTeamsObj = Object.create(res);
              for(let key in uclTeamsObj) {
                this.uclTeams.push({ id: key, ...uclTeamsObj[key] });
              }

              return this.uclTeams;
            }))
            .subscribe(res => {
              this.uclTeamsSubject.next([...res]);
            });
  }

  private allUclPlayers() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/players.json')
            .pipe(map(res => {
              let uclPlayersObj = Object.create(res);
              for(let key in uclPlayersObj) {
                this.uclPlayers.push({ id: key, ...uclPlayersObj[key] });
              }

              return this.uclPlayers;
            }))
            .subscribe(res => {
              this.uclPlayersSubject.next([...res]);
            });
  }

  private allUclTransfers() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/transfers.json')
            .pipe(map(res => {
              let uclTransfersObj = Object.create(res);
              for(let key in uclTransfersObj) {
                this.uclTransfers.push({ id: key, ...uclTransfersObj[key] });
              }

              return this.uclTransfers;
            }))
            .subscribe(res => {
              this.uclTransfersSubject.next([...res]);
            });
  }

  getUclTeams() {
    return this.uclTeamsSubject;
  }

  getUclPlayers() {
    return this.uclPlayersSubject;
  }

  getUclTransfers() {
    return this.uclTransfersSubject;
  }

  addUclTeam(uclTeamDb: TeamUclDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/teams.json', uclTeamDb)
              .subscribe(res => {
                let uclTeamIdObj = Object.create(res);
                let uclTeamId = uclTeamIdObj['name'];
                let uclTeam: TeamUcl = { id: uclTeamId, ...uclTeamDb }
                this.uclTeams.push(uclTeam);
                this.uclTeamsSubject.next([...this.uclTeams]);
              });
  }

  addUclPlayer(uclPlayerDb: PlayerUclDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/players.json', uclPlayerDb)
              .subscribe(res => {
                let uclPlayerIdObj = Object.create(res);
                let uclPlayerId = uclPlayerIdObj['name'];
                let uclPlayer: PlayerUcl = { id: uclPlayerId, ...uclPlayerDb }
                this.uclPlayers.push(uclPlayer);
                this.uclPlayersSubject.next([...this.uclPlayers]);
              });
  }

  addUclTransfer(uclTransferDb: TransferUclDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/transfers.json', uclTransferDb)
              .subscribe(res => {
                let uclTransferIdObj = Object.create(res);
                let uclTransferId = uclTransferIdObj['name'];
                let uclTransfer: TransferUcl = { id: uclTransferId, ...uclTransferDb }
                this.uclTransfers.push(uclTransfer);
                this.uclTransfersSubject.next([...this.uclTransfers]);
              });
  }

  deleteUclTeam(id: string) {
    this.http.delete(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/teams/${id}.json`)
            .subscribe(res => {
              let uclTeamIndex = this.uclTeams.findIndex(t => t.id == id);
              let uclTeamDeleteId = this.uclTeams[uclTeamIndex].id;
              this.uclPlayers.forEach(p => {
                if(p.teamId == uclTeamDeleteId) p.teamId = '';
              });
              this.uclPlayersSubject.next([...this.uclPlayers]);

              this.uclTeams = this.uclTeams.filter(t => t.id != id);
              this.uclTeamsSubject.next([...this.uclTeams]);
            });
  }

  deleteUclPlayer(id: string) {
    this.http.delete(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/players/${id}.json`)
            .subscribe(res => {
              this.uclPlayers = this.uclPlayers.filter(p => p.id != id);
              this.uclPlayersSubject.next([...this.uclPlayers]);
            });
  }

  editUclPlayer(id: string, uclPlayerDb: PlayerUclDb) {
      this.http.patch(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/ucl/players/${id}.json`, uclPlayerDb)
              .subscribe(res => {
                let index = this.uclPlayers.findIndex(p => p.id == id);
                this.uclPlayers[index] = { id: id, ...uclPlayerDb };
                this.uclPlayersSubject.next([...this.uclPlayers]);
              });
  }
}
