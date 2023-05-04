import { IUserSession } from "../ts/interfaces/IUserSession";
import { Socket } from "socket.io";
import { Message } from "../models/Message";

export const sendMessage = async (
    socket: Socket,
    receiverId: number,
    message: string
) => {
    try {
        const session = socket.request.session as IUserSession;

        await Message.save(session.userId, receiverId, message);
    } catch (error) {
        console.log(error);
    }
};
