import { IUserSession } from "../ts/interfaces/IUserSession";
import { ContactsModel } from "../models/Contact";
import { Socket } from "socket.io";
import { ContactStatus } from "../ts/enums/contactStatus";

// Контроллер, отвечающий за получение контактов и создания rooms
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
        socket.emit("error", { message: "Cannot get contacts." });
    }
};

// Контроллер, отвечающий за получение запросов на добавление в контакты
export const getRequests = async (socket: Socket) => {
    try {
        const session = socket.request.session as IUserSession;

        const requests = await ContactsModel.findAllRequests(session.userId);

        socket.emit("get_requests", requests);
    } catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot get friend requests." });
    }
};

// Контроллер, отвечающий за отправку запроса на добавление в контакты
export const sendFriendRequest = async (socket: Socket, friendId: number) => {
    try {
        const session = socket.request.session as IUserSession;

        const areContacts = await ContactsModel.areContacts(
            session.userId,
            friendId
        );

        if (areContacts) return;

        await ContactsModel.save(
            session.userId,
            friendId,
            ContactStatus.PENDING
        );
    } catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot send friend request." });
    }
};

// Контроллер, отвечающий за принятия запроса на добавление в контакты
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
        socket.emit("error", { message: "Cannot accept request." });
    }
};

// Контроллер, отвечающий за отказ от добавления в контакты
export const declineFriendRequest = async (
    socket: Socket,
    friendId: number
) => {
    try {
        const session = socket.request.session as IUserSession;

        await ContactsModel.save(
            friendId,
            session.userId,
            ContactStatus.DECLINED
        );
    } catch (error) {
        console.log(error);
        socket.emit("error", { message: "Cannot decline request." });
    }
};
