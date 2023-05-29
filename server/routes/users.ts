import { Router } from "express";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import {
    searchUser,
    updateUser,
    deleteUser,
} from "../controllers/usersController";

export const usersRouter = Router();

// Путь поиска пользователей
usersRouter.get("/", checkSessionMiddleware, searchUser);

// Путь обновления пользовательской информации
usersRouter.put("/", checkSessionMiddleware, updateUser);

// Путь удаления пользовалеля
usersRouter.delete("/", checkSessionMiddleware, deleteUser);
