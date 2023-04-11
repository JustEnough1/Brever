import { DatabaseManager } from "../database/DatabaseManager";

export class UserModel {
    private firstname: string;
    private lastname: string;
    private username: string;
    private password: string;

    constructor(
        firstname: string,
        lastname: string,
        username: string,
        password: string
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
    }

    async save() {
        return await DatabaseManager.executeQuery(
            `INSERT INTO users VALUES (DEFAULT, "${this.username}", "${this.password}", "${this.firstname}", "${this.lastname}", DEFAULT, DEFAULT, DEFAULT)`
        );
    }
}
