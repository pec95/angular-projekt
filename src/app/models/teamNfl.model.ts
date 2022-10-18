export class TeamNfl {
    id: string;
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
    winPercentage: string;
    
    constructor(id: string, coach: string, conference: string, division: string, established: number, image: string, losses: number, stadium: string, 
                superbowlTitles: number, teamName: string, ties: number, wins: number, winPercentage: string) {
        this.id = id;
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
        this.winPercentage = winPercentage;
    }
}