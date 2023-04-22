"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
dotenv_1.default.config();
const PORT = 3000;
const app = (0, express_1.default)();
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});
app.use(express_1.default.json());
app.use(sessionMiddleware);
app.use("/auth", auth_1.authRouter);
app.use("/users", users_1.usersRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
