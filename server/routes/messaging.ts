import { Server } from "socket.io";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";
import { fetchMessages, sendMessage } from "../controllers/messagingController";

// Функция, регистрирующая слушателей событий
export default function setupMessagingSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        // Отправка сообщений
        socket.on("send_message", async ({ receiverId, message }) => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    sendMessage(socket, io, receiverId, message);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });

        // Получение сообщений
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
