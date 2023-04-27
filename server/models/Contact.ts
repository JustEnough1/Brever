import { DatabaseManager } from "../database/DatabaseManager";
import { ContactStatus } from "../ts/enums/contactStatus";

export class ContactsModel {
    static async save(userId: number, friendId: number, status: ContactStatus) {
        try {
            let query = "";
            switch (status) {
                case ContactStatus.PENDING:
                    query = `INSERT INTO contacts (user_id, friend_id) VALUES (${userId}, ${friendId})`;
                    break;

                case ContactStatus.ACCEPTED:
                    query = `INSERT INTO contacts (user_id, friend_id, status) VALUES (${userId}, ${friendId}, '${status}'), (${friendId}, ${userId}, '${status}') ON DUPLICATE KEY UPDATE status = VALUES(status);`;
                    break;

                default:
                    break;
            }

            return await DatabaseManager.executeQuery(query);
        } catch (error) {
            console.log(error);

            return new Error("Error");
        }
    }

    static async findAll(userId: number): Promise<IProfile[]> {
        return await DatabaseManager.executeQuery(
            `
            SELECT users.id, users.first_name, users.last_name, users.avatar
            FROM contacts
            INNER JOIN users ON friend_id = users.id
            WHERE user_id = ${userId} AND status = '${ContactStatus.ACCEPTED}'
            `
        );
    }
}
