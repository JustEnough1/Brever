import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { contactssRouter } from "./routes/contacts";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./ts/interfaces/ISocketIO";
import {
    checkSessionMiddleware,
    checkSocketSessionMiddleware,
} from "./middlewares/checkSession";
import {
    acceptFriendRequest,
    getContacts,
    sendFriendRequest,
} from "./controllers/contactsController";

dotenv.config();

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer);

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
});

app.use(express.json());

app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(
        socket.request as Request,
        {} as Response,
        next as NextFunction
    );
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/contacts", contactssRouter);

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

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
