import { Router } from "express";
import { UserModel } from "../models/User";
import { validateUsername } from "../middlewares/validateUsername";
import { validatePassword } from "../middlewares/validatePassword";
import { validateName } from "../middlewares/validateName";

export const authRouter = Router();

authRouter.post(
    "/signup",
    validateUsername,
    validatePassword,
    validateName,
    async (req, res) => {
        try {
            const { firstname, lastname, username, password } = req.body;

            await UserModel.save(username, password, firstname, lastname).catch(
                (error) => {
                    throw error;
                }
            );

            res.send({ message: "New account created." });
        } catch (error) {
            res.send({
                message: "Cannot create new account. Try again later.",
            });
        }
    }
);

authRouter.post(
    "/login",
    validateUsername,
    validatePassword,
    async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await UserModel.findUser(username);

            if (user === undefined || !(password === user.password))
                return res.status(400).json({
                    message: "Wrong username or password.",
                });

            res.json({ message: "Logged successfully." });
        } catch (error) {
            res.json({ message: "Cannot log in. Try again later." });
        }
    }
);
