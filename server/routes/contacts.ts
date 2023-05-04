import { Server } from "socket.io";
import {
    getContacts,
    sendFriendRequest,
    acceptFriendRequest,
} from "../controllers/contactsController";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";

export default function setupContactsSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        socket.on("get_contacts", async () => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    getContacts(socket);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });

        socket.on("send_friend_request", async ({ friendId }) => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    sendFriendRequest(socket, friendId);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });

        socket.on("accept_friend_request", async ({ friendId }) => {
            try {
                await checkSocketSessionMiddleware(socket, () => {
                    acceptFriendRequest(socket, friendId);
                });
            } catch (error) {
                socket.emit("error", { message: "Error" });
            }
        });
    });
}
