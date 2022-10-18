export class PlayerNflDb {
    age: number;
    name: string;
    position: string;
    teamId: string;
    value: number;

    constructor(age: number, name: string, position: string, teamId: string, value: number) {
        this.age = age;
        this.name = name;
        this.position = position;
        this.teamId = teamId;
        this.value = value;
    }
}