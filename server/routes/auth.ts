import { Router } from "express";
import { validateUsernameMiddleware } from "../middlewares/validateUsername";
import { validatePasswordMiddleware } from "../middlewares/validatePassword";
import { validateNameMiddleware } from "../middlewares/validateName";
import { checkSessionMiddleware } from "../middlewares/checkSession";
import { login, logout, signup } from "../controllers/authController";

export const authRouter = Router();

authRouter.post(
    "/signup",
    validateUsernameMiddleware,
    validatePasswordMiddleware,
    validateNameMiddleware,
    signup
);

authRouter.post(
    "/login",
    validateUsernameMiddleware,
    validatePasswordMiddleware,
    login
);

authRouter.post("/logout", checkSessionMiddleware, logout);
