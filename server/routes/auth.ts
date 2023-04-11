import { Router } from "express";
import { UserModel } from "../models/User";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;

        const newUser = new UserModel(firstname, lastname, username, password);

        await newUser.save().catch((error) => {
            throw error;
        });

        res.send({ message: "New account created." });
    } catch (error) {
        res.send({ message: "Cannot create new account. Try later." });
    }
});
