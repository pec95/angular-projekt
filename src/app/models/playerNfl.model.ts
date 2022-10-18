export class PlayerNfl {
    id: string;
    age: number;
    name: string;
    position: string;
    teamId: string;
    value: number;

    constructor(id: string, age: number, name: string, position: string, teamId: string, value: number) {
        this.id = id;
        this.age = age;
        this.name = name;
        this.position = position;
        this.teamId = teamId;
        this.value = value;
    }
}