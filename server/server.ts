import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import setupAuthSocketListeners, { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./ts/interfaces/ISocketIO";
import setupContactsSocketListeners from "./routes/contacts";

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

setupContactsSocketListeners(io);
setupAuthSocketListeners(io);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
