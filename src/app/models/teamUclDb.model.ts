export class TeamUclDb {
    coach: string;
    established: number;
    image: string;
    stadium: string;
    teamName: string;
    
    constructor(coach: string, established: number, image: string, stadium: string, teamName: string) {
        this.coach = coach;
        this.established = established;
        this.image = image;
        this.stadium = stadium;
        this.teamName = teamName;
    }
}