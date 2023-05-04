import { IUserSession } from "../ts/interfaces/IUserSession";
import { Server, Socket } from "socket.io";
import { Message } from "../models/Message";

export const sendMessage = async (
    socket: Socket,
    io: Server,
    receiverId: number,
    message: string
) => {
    try {
        const session = socket.request.session as IUserSession;

        const result = await Message.save(session.userId, receiverId, message);

        const contactIds = [session.userId, receiverId].sort();
        io.to(`chat-${contactIds[0]}-${contactIds[1]}`).emit(
            "send_message",
            result
        );
    } catch (error) {
        console.log(error);
        socket.emit("error", { message: "Error" });
    }
};
