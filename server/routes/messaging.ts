import { Server } from "socket.io";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";
import { sendMessage } from "../controllers/messagingController";

export default function setupMessagingSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        socket.on(
            "send_message",
            async (receiverId: number, message: string) => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        sendMessage(socket, receiverId, message);
                    });
                } catch (error) {
                    socket.emit("error", { message: "Error" });
                }
            }
        );
    });
}
