import { ContactsModel } from "./Contact";

export class Message {
    static async save(senderId: number, receiverId: number, message: string) {
        try {
            const areContacts = await ContactsModel.areContacts(
                senderId,
                receiverId
            );

            if (!areContacts)
                throw new Error("Sender and receiver aren't contacts");
        } catch (error) {
            return error;
        }
    }
}
