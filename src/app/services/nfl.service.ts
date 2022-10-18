import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TeamNflDb } from '../models/teamNflDb.model';
import { TeamNfl } from '../models/teamNfl.model';
import { PlayerNfl } from '../models/playerNfl.model';
import { TradeNfl } from '../models/tradeNfl.model';
import { TradeNflDb } from '../models/tradeNflDb.model';
import { PlayerNflDb } from '../models/playerNflDb.model';

@Injectable({
  providedIn: 'root'
})
export class NflService {
  nflTeams: TeamNfl[] = [];
  nflTeamsEmpty: TeamNfl[] = [];
  nflTeamsSubject: BehaviorSubject<TeamNfl[]>;

  nflPlayers: PlayerNfl[] = [];
  nflPlayersEmpty: PlayerNfl[] = [];
  nflPlayersSubject: BehaviorSubject<PlayerNfl[]>;

  nflTrades: TradeNfl[] = [];
  nflTradesEmpty: TradeNfl[] = [];
  nflTradesSubject: BehaviorSubject<TradeNfl[]>;

  constructor(private http: HttpClient) {
    this.nflTeamsSubject = new BehaviorSubject(this.nflTeamsEmpty);
    this.allNflTeams();

    this.nflPlayersSubject = new BehaviorSubject(this.nflPlayersEmpty);
    this.allNflPlayers();

    this.nflTradesSubject = new BehaviorSubject(this.nflTradesEmpty);
    this.allNflTrades();
  }

  private allNflTeams() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/teams.json')
            .pipe(map(res => {
              let nflTeamsObj = Object.create(res);
              for(let key in nflTeamsObj) {
                nflTeamsObj[key].winPercentage = '.' + ((nflTeamsObj[key].wins / 17) * 1000).toFixed(0);
                this.nflTeams.push({ id: key, ...nflTeamsObj[key] });
              }

              return this.nflTeams;
            }))
            .subscribe(res => {
              this.nflTeamsSubject.next([...res]);
            });
  }

  private allNflPlayers() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/players.json')
            .pipe(map(res => {
              let nflPlayersObj = Object.create(res);
              for(let key in nflPlayersObj) {
                this.nflPlayers.push({ id: key, ...nflPlayersObj[key] });
              }

              return this.nflPlayers;
            }))
            .subscribe(res => {
              this.nflPlayersSubject.next([...res]);
            });
  }

  private allNflTrades() {
    this.http.get('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/trades.json')
            .pipe(map(res => {
              let nflTradesObj = Object.create(res);
              for(let key in nflTradesObj) {
                this.nflTrades.push({ id: key, ...nflTradesObj[key] });
              }

              return this.nflTrades;
            }))
            .subscribe(res => {
              this.nflTradesSubject.next([...res]);
            });
  }

  getNflTeams() {
    return this.nflTeamsSubject;
  }

  getNflPlayers() {
    return this.nflPlayersSubject;
  }

  getNflTrades() {
    return this.nflTradesSubject;
  }

  addNflTeam(nflTeamDb: TeamNflDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/teams.json', nflTeamDb)
              .subscribe(res => {
                let nflTeamIdObj = Object.create(res);
                let nflTeamId = nflTeamIdObj['name'];
                
                let winPct: string = '.' + ((nflTeamDb.wins / 17) * 1000).toFixed(0);
                
                let nflTeam: TeamNfl = { id: nflTeamId, ...nflTeamDb, winPercentage: winPct }
                this.nflTeams.push(nflTeam);
                this.nflTeamsSubject.next([...this.nflTeams]);
              });
  }

  addNflPlayer(nflPlayerDb: PlayerNflDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/players.json', nflPlayerDb)
              .subscribe(res => {
                let nflPlayerIdObj = Object.create(res);
                let nflPlayerId = nflPlayerIdObj['name'];
                let nflPlayer: PlayerNfl = { id: nflPlayerId, ...nflPlayerDb }
                this.nflPlayers.push(nflPlayer);
                this.nflPlayersSubject.next([...this.nflPlayers]);
              });
  }

  addNflTrade(nflTradeDb: TradeNflDb) {
    this.http.post('https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/trades.json', nflTradeDb)
              .subscribe(res => {
                let nflTradeIdObj = Object.create(res);
                let nflTradeId = nflTradeIdObj['name'];
                let nflTrade: TradeNfl = { id: nflTradeId, ...nflTradeDb }
                this.nflTrades.push(nflTrade);
                this.nflTradesSubject.next([...this.nflTrades]);
              });
  }

  deleteNflTeam(id: string) {
    this.http.delete(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/teams/${id}.json`)
            .subscribe(res => {
              let nflTeamIndex = this.nflTeams.findIndex(t => t.id == id);
              let nflTeamDeleteId = this.nflTeams[nflTeamIndex].id;
              this.nflPlayers.forEach(p => {
                if(p.teamId == nflTeamDeleteId) p.teamId = '';
              });
              this.nflPlayersSubject.next([...this.nflPlayers]);

              this.nflTeams = this.nflTeams.filter(t => t.id != id);
              this.nflTeamsSubject.next([...this.nflTeams]);
            });
  }

  deleteNflPlayer(id: string) {
    this.http.delete(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/players/${id}.json`)
            .subscribe(res => {
              this.nflPlayers = this.nflPlayers.filter(p => p.id != id);
              this.nflPlayersSubject.next([...this.nflPlayers]);
            });
  }

  editNflPlayer(id: string, nflPlayerDb: PlayerNflDb) {
    this.http.patch(`https://angular-2ac85-default-rtdb.europe-west1.firebasedatabase.app/nfl/players/${id}.json`, nflPlayerDb)
            .subscribe(res => {
              let index = this.nflPlayers.findIndex(p => p.id == id);
              this.nflPlayers[index] = { id: id, ...nflPlayerDb };
              this.nflPlayersSubject.next([...this.nflPlayers]);
            });
  }
    
}
