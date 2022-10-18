export class TeamNflDb {
    coach: string;
    conference: string;
    division: string;
    established: number;
    image: string;
    losses: number;
    stadium: string;
    superbowlTitles: number;
    teamName: string;
    ties: number;
    wins: number;
    
    constructor(coach: string, conference: string, division: string, established: number, image: string, losses: number, stadium: string, 
                superbowlTitles: number, teamName: string, ties: number, wins: number) {
        this.coach = coach;
        this.conference = conference;
        this.division = division;
        this.established = established;
        this.image = image;
        this.losses = losses;
        this.superbowlTitles = superbowlTitles; 
        this.stadium = stadium;
        this.teamName = teamName;
        this.ties = ties;
        this.wins = wins;
    }
}