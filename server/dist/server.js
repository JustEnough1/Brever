"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
const contacts_1 = require("./routes/contacts");
const checkSession_1 = require("./middlewares/checkSession");
const contactsController_1 = require("./controllers/contactsController");
dotenv_1.default.config();
const PORT = 3000;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});
app.use(express_1.default.json());
app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});
app.use("/auth", auth_1.authRouter);
app.use("/users", users_1.usersRouter);
app.use("/contacts", contacts_1.contactssRouter);
io.on("connection", (socket) => {
    socket.on("get_contacts", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                (0, contactsController_1.getContacts)(socket);
            });
        }
        catch (error) {
            socket.emit("error", { message: "Error" });
        }
    }));
    socket.on("send_friend_request", ({ friendId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                (0, contactsController_1.sendFriendRequest)(socket, friendId);
            });
        }
        catch (error) {
            socket.emit("error", { message: "Error" });
        }
    }));
    socket.on("accept_friend_request", ({ friendId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, checkSession_1.checkSocketSessionMiddleware)(socket, () => {
                (0, contactsController_1.acceptFriendRequest)(socket, friendId);
            });
        }
        catch (error) {
            socket.emit("error", { message: "Error" });
        }
    }));
});
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
