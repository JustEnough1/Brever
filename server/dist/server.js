"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importStar(require("./routes/auth"));
const users_1 = require("./routes/users");
const contacts_1 = __importDefault(require("./routes/contacts"));
const messaging_1 = __importDefault(require("./routes/messaging"));
const User_1 = require("./models/User");
dotenv_1.default.config();
const PORT = process.env.SERVER_PORT;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
});
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});
app.use("/auth", auth_1.authRouter);
app.use("/users", users_1.usersRouter);
(0, contacts_1.default)(io);
(0, auth_1.default)(io);
(0, messaging_1.default)(io);
const storage = multer_1.default.diskStorage({
    destination: "./public/images/avatars/",
    filename: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const username = yield (yield User_1.UserModel.findById(req.session.userId)).username;
        cb(null, `${username}.jpg`);
    }),
});
exports.upload = (0, multer_1.default)({ storage }).single("avatar");
app.get("*", (req, res) => {
    try {
        res.sendFile(path_1.default.join(__dirname, "..", "public", "index.html"));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
});
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.\nSee application here - http://localhost:${PORT}/`);
});
