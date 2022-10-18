export class TradeNfl {
    id: string;
    team1Id: string;
    team2Id: string;
    player1Ids: string[];
    player2Ids: string[];
    timestamp: string;
    gradeTeam1: number;
    gradeTeam2: number;

    constructor(id: string, team1Id: string, team2Id: string, player1Ids: string[], player2Ids: string[], timestamp: string, gradeTeam1: number, gradeTeam2: number) {
        this.id = id;
        this.team1Id = team1Id;
        this.team2Id = team2Id;
        this.player1Ids = player1Ids;
        this.player2Ids = player2Ids;        
        this.timestamp = timestamp;
        this.gradeTeam1 = gradeTeam1;
        this.gradeTeam2 = gradeTeam2;
    }
}