import { Request, Response } from "express";
import { IUserSession } from "../ts/interfaces/IUserSession";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

// Контроллер, отвечающий за регистрацию
export const signup = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        if (session.userId) {
            const user = (await UserModel.findById(session.userId)) as IUser;
            const profile: IProfile = UserModel.getProfileFromUser(user);

            return res.json({ user: profile });
        }

        const { firstname, lastname, username, password } = req.body;

        const { hashedPassword, salt } = UserModel.hashPassword(password);

        const newUser = await UserModel.save(
            username,
            hashedPassword,
            salt,
            firstname,
            lastname
        ).catch((error) => {
            throw error;
        });

        session.userId = newUser.insertId;

        const user = await UserModel.findById(session.userId);

        const profile: IProfile = UserModel.getProfileFromUser(user);

        res.json({ user: profile });
    } catch (error) {
        res.status(500).json({
            message: "Cannot create a new account.",
        });
    }
};

// Контроллер, отвечающий за вход в аккаунт
export const login = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        if (session.userId) {
            const user = (await UserModel.findById(session.userId)) as IUser;
            const profile: IProfile = UserModel.getProfileFromUser(user);

            return res.json({ user: profile });
        }

        const { username, password } = req.body;

        const user = (await UserModel.findByUsername(username)) as IUser;

        if (!user) {
            return res.status(400).json({
                message: "Wrong username or password.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({
                message: "Wrong username or password.",
            });

        session.userId = user.id;

        const profile: IProfile = UserModel.getProfileFromUser(user);

        res.json({ user: profile });
    } catch (error) {
        res.status(500).json({ message: "Cannot log in." });
    }
};

// Контроллер, отвечающий за выход из аккаунта
export const logout = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        session.destroy((err) => {
            if (err) throw err;
            return res.json({ message: "User has been logged out." });
        });
    } catch (error) {
        res.status(500).json({ message: "Cannot log out." });
    }
};

// Контроллер, отвечающий за проверку наличия сессии пользователя
export const checkSession = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        const user = UserModel.getProfileFromUser(
            await UserModel.findById(session.userId)
        );

        return res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Cannot check session." });
    }
};
