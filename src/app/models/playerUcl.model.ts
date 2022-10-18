export class PlayerUcl {
    id: string;
    age: number;
    name: string;
    position: string;
    teamId: string;

    constructor(id: string, age: number, name: string, position: string, teamId: string) {
        this.id = id;
        this.age = age;
        this.name = name;
        this.position = position;
        this.teamId = teamId;
    }
}