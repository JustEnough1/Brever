import { Server } from "socket.io";
import {
    getContacts,
    sendFriendRequest,
    acceptFriendRequest,
    getRequests,
    declineFriendRequest,
} from "../controllers/contactsController";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";

// Функция, регистрирующая слушателей событий
export default function setupContactsSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        try {
            // Получение контактов
            socket.on("get_contacts", async () => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        getContacts(socket);
                    });
                } catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            });

            // Получение запросов
            socket.on("get_requests", async () => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        getRequests(socket);
                    });
                } catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            });

            // Отправка запроса на добавление в контакты
            socket.on("send_friend_request", async (payload) => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        if (payload.friendId)
                            sendFriendRequest(socket, payload.friendId);
                    });
                } catch (error) {
                    socket.emit("error", { message: "Error" });
                }
            });

            // Принятие запроса на добавление в контакты
            socket.on("accept_friend_request", async (payload) => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        if (payload.friendId)
                            acceptFriendRequest(socket, payload.friendId);
                        else {
                            throw new Error("Please provide payload.");
                        }
                    });
                } catch (error) {
                    socket.emit("error", { message: error });
                }
            });

            // Отказ от запроса на добавление в контакты
            socket.on("decline_friend_request", async (payload) => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        if (payload.friendId)
                            declineFriendRequest(socket, payload.friendId);
                        else {
                            throw new Error("Please provide payload.");
                        }
                    });
                } catch (error) {
                    socket.emit("error", { message: error });
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
}
