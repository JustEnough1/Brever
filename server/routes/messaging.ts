import { Server } from "socket.io";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";
import { fetchMessages, sendMessage } from "../controllers/messagingController";

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

        socket.on("fetch_messages", async ({ friendId, offset }) => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    fetchMessages(socket, friendId, offset);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });
    });
}
