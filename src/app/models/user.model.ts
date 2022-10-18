export class User {
    id: string;
    admin: boolean;
    email: string;
    password: string;
    username: string;

    constructor(id: string, admin: boolean, email: string, password: string , username: string) {
        this.id = id;
        this.admin = admin;
        this.email = email;
        this.password = password;
        this.username = username;
    }
}