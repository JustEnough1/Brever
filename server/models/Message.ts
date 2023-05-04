import { DatabaseManager } from "../database/DatabaseManager";
import { ContactsModel } from "./Contact";

export class Message {
    static async save(senderId: number, receiverId: number, message: string) {
        const areContacts = await ContactsModel.areContacts(
            senderId,
            receiverId
        );

        if (!areContacts)
            throw new Error("Sender and receiver aren't contacts");

        const result = await DatabaseManager.executeQuery(
            `INSERT INTO messages (sender_id, receiver_id, message) VALUES (${senderId}, ${receiverId},'${message}')`
        );

        return await DatabaseManager.executeQuery(
            `SELECT * FROM messages WHERE id = ${result.insertId}`
        );
    }
}
