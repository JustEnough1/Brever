import { Router } from "express";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import {
    searchUser,
    updateUser,
    deleteUser,
} from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.get("/", checkSessionMiddleware, searchUser);
usersRouter.put("/", checkSessionMiddleware, updateUser);
usersRouter.delete("/", checkSessionMiddleware, deleteUser);
