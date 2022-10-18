export class Trade {
    team1: string;
    team2: string;
    players1: string[];
    players2: string[];
    timestamp: string;
    gradeTeam1: number;
    gradeTeam2: number;

    constructor(team1: string, team2: string, players1: string[], players2: string[], timestamp: string, gradeTeam1: number, gradeTeam2: number) {
        this.team1 = team1;
        this.team2 = team2;
        this.players1 = players1;
        this.players2 = players2;        
        this.timestamp = timestamp;
        this.gradeTeam1 = gradeTeam1;
        this.gradeTeam2 = gradeTeam2;
    }
}