import { Router } from "express";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import { updateUser } from "../controllers/usersController";

export const usersRouter = Router();

usersRouter.put("/", checkSessionMiddleware, updateUser);
