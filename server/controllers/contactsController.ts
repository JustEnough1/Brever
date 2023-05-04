import { IUserSession } from "../ts/interfaces/IUserSession";
import { ContactsModel } from "../models/Contact";
import { Socket } from "socket.io";
import { ContactStatus } from "../ts/enums/contactStatus";

export const getContacts = async (socket: Socket) => {
    try {
        const session = socket.request.session as IUserSession;

        const contacts = await ContactsModel.findAll(session.userId);

        contacts.forEach((contact) => {
            const contactIds = [session.userId, contact.id].sort();
            socket.join(`chat-${contactIds[0]}-${contactIds[1]}`);
        });

        socket.emit("get_contacts", contacts);
    } catch (error) {
        console.log(error);
    }
};

export const sendFriendRequest = async (socket: Socket, friendId: number) => {
    try {
        const session = socket.request.session as IUserSession;

        await ContactsModel.save(
            session.userId,
            friendId,
            ContactStatus.PENDING
        );
    } catch (error) {
        console.log(error);
    }
};

export const acceptFriendRequest = async (socket: Socket, friendId: number) => {
    try {
        const session = socket.request.session as IUserSession;

        await ContactsModel.save(
            session.userId,
            friendId,
            ContactStatus.ACCEPTED
        );
    } catch (error) {
        console.log(error);
    }
};