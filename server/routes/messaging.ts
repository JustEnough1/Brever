import { Server } from "socket.io";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";
import { sendMessage } from "../controllers/messagingController";

export default function setupMessagingSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        socket.on("send_message", async ({ receiverId, message }) => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    sendMessage(socket, io, receiverId, message);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });
    });
}
