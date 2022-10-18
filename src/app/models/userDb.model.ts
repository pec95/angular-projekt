export class UserDb {
    admin: boolean;
    email: string;
    password: string;
    username: string;

    constructor(admin: boolean, email: string, password: string , username: string) {
        this.admin = admin;
        this.email = email;
        this.password = password;
        this.username = username;
    }
}