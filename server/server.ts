import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
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
import setupMessagingSocketListeners from "./routes/messaging";
import { UserModel } from "./models/User";

dotenv.config();

const PORT = process.env.SERVER_PORT;

const app = express();
const httpServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
});

app.use(express.static("public"));

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

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
setupMessagingSocketListeners(io);

const storage = multer.diskStorage({
    destination: "./public/images/avatars/",
    filename: async (req, file, cb) => {
        const username = await (
            await UserModel.findById(req.session.userId)
        ).username;
        cb(null, `${username}.jpg`);
    },
});

export const upload = multer({ storage }).single("avatar");

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
