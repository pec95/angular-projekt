export class TeamUcl {
    id: string;
    coach: string;
    established: number;
    image: string;
    stadium: string;
    teamName: string;
    
    constructor(id: string, coach: string, established: number, image: string, stadium: string, teamName: string) {
        this.id = id;
        this.coach = coach;
        this.established = established;
        this.image = image;
        this.stadium = stadium;
        this.teamName = teamName;
    }
}