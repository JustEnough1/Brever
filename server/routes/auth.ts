import { Router } from "express";
import { validateUsernameMiddleware } from "../middlewares/validateUsername";
import { validatePasswordMiddleware } from "../middlewares/validatePassword";
import { validateNameMiddleware } from "../middlewares/validateName";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import {
    checkSession,
    login,
    logout,
    signup,
} from "../controllers/authController";
import { Server } from "socket.io";

export const authRouter = Router();

// Путь регистрации
authRouter.post(
    "/signup",
    validateUsernameMiddleware,
    validatePasswordMiddleware,
    validateNameMiddleware,
    signup
);

// Путь входа в аккаунта
authRouter.post(
    "/login",
    validateUsernameMiddleware,
    validatePasswordMiddleware,
    login
);

// Путь выхода из аккаунта
authRouter.post("/logout", checkSessionMiddleware, logout);

// Путь проверки сессии
authRouter.post("/check-session", checkSessionMiddleware, checkSession);

// Функция, регистрирующая слушателей событий
export default function setupAuthSocketListeners(io: Server) {}
