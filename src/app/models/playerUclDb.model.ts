export class PlayerUclDb {
    age: number;
    name: string;
    position: string;
    teamId: string;

    constructor(age: number, name: string, position: string, teamId: string) {
        this.age = age;
        this.name = name;
        this.position = position;
        this.teamId = teamId;
    }
}