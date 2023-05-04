import { Router } from "express";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import { searchUser, updateUser } from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.get("/", checkSessionMiddleware, searchUser);
usersRouter.put("/", checkSessionMiddleware, updateUser);
