import bcrypt from "bcryptjs";
import { DatabaseManager } from "../database/DatabaseManager";

// Класс, отвечающий за работу, связанной с пользователем
export class UserModel {
    // Метод удаления пользователя
    static async delete(userId: number) {
        return await DatabaseManager.executeQuery(
            `DELETE FROM users WHERE id = ${userId}`
        );
    }

    // Метод хеширования пароля
    static hashPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        return { hashedPassword, salt };
    }

    // Метод сохранения в базу данных
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

    // Метод получения пользователя по его имени пользователя
    static async findByUsername(username: string) {
        const user = await DatabaseManager.executeQuery(
            `SELECT * FROM users WHERE username = "${username}"`
        );

        return user[0];
    }

    // Метод получения пользователя по его уникальному идентификатору
    static async findById(id: number) {
        const user: IUser[] = await DatabaseManager.executeQuery(
            `SELECT * FROM users WHERE id = ${id}`
        );

        return user[0];
    }

    // Метод получения пользователей по их примерному имени пользователя
    static async findBySearchValue(searchValue: string, userId: number) {
        let users = await DatabaseManager.executeQuery(
            `SELECT *
            FROM users
            WHERE username LIKE '%${searchValue}%'
            AND id != ${userId}
            AND id NOT IN (
                SELECT friend_id
                FROM contacts
                WHERE user_id = ${userId}
            );
            `
        );

        users = users.map((user: IUser) => {
            return UserModel.getProfileFromUser(user);
        });

        return users;
    }

    // Метод, приводящий IUser в IProfile
    static getProfileFromUser(user: IUser): IProfile {
        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
        };
    }

    // Метод обновления пользователя
    static async update(
        userId: number,
        user: {
            username?: string;
            password?: string;
            first_name?: string;
            last_name?: string;
            avatar?: string;
        }
    ) {
        let query = `UPDATE users SET `;

        if (user.username) {
            query += ` username = '${user.username}',`;
        }

        if (user.password) {
            const { hashedPassword, salt } = UserModel.hashPassword(
                user.password
            );
            query += ` password = '${hashedPassword}', salt = '${salt}',`;
        }

        if (user.first_name) {
            query += ` first_name = '${user.first_name}',`;
        }

        if (user.last_name) {
            query += ` last_name = '${user.last_name}',`;
        }

        if (user.avatar) {
            query += ` avatar = '${user.avatar}',`;
        }

        query = query.slice(0, -1);

        query += `, updated_at = NOW() WHERE id = ${userId}`;

        return await DatabaseManager.executeQuery(query);
    }
}
