import { DatabaseManager } from "../database/DatabaseManager";

export class UserModel {
    static async save(
        username: string,
        password: string,
        salt: string,
        firstname: string,
        lastname: string
    ) {
        return await DatabaseManager.executeQuery(
            `INSERT INTO users VALUES (DEFAULT, "${username}", "${password}", "${salt}", "${firstname}", "${lastname}", DEFAULT, DEFAULT, DEFAULT)`
        );
    }

    static async find(username: string) {
        const user = await DatabaseManager.executeQuery(
            `SELECT * FROM users WHERE username = "${username}"`
        );

        return user[0];
    }
}
