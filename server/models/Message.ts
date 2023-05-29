import { DatabaseManager } from "../database/DatabaseManager";
import { ContactsModel } from "./Contact";

// Класс, отвечающий за работу, связанной с сообщениями
export class Message {
    // Метод сохранения в базу данных
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

    // Метод получения сообщений
    static async find(userId: number, friendId: number, offset: number) {
        const messages: IMessage[] = await DatabaseManager.executeQuery(
            `SELECT sender_id, receiver_id, message, created_at FROM messages
           WHERE (sender_id = ${userId} AND receiver_id = ${friendId}) OR (sender_id = ${friendId} AND receiver_id = ${userId})
           ORDER BY created_at DESC
           LIMIT 20 OFFSET ${offset}`
        );

        return messages;
    }
}
