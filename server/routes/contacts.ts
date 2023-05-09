import { Server } from "socket.io";
import {
    getContacts,
    sendFriendRequest,
    acceptFriendRequest,
    getRequests,
    declineFriendRequest,
} from "../controllers/contactsController";
import { checkSocketSessionMiddleware } from "../middlewares/checkSession";

export default function setupContactsSocketListeners(io: Server) {
    io.on("connection", (socket) => {
        try {
            socket.on("get_contacts", async () => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        getContacts(socket);
                    });
                } catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            });

            socket.on("get_requests", async () => {
                try {
                    await checkSocketSessionMiddleware(socket, () => {
                        getRequests(socket);
                    });
                } catch (error) {
                    socket.emit("error", { error: "Error" });
                }
            });

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
