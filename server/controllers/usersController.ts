import { Request, Response } from "express";
import { IUserSession } from "../ts/interfaces/IUserSession";
import { UserModel } from "../models/User";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        const { username, password, first_name, last_name, avatar } = req.body;

        await UserModel.update(session.userId, {
            username,
            password,
            first_name,
            last_name,
            avatar,
        }).catch((err) => {
            throw err;
        });

        const profile: IProfile = UserModel.getProfileFromUser(
            await UserModel.findById(session.userId)
        );

        res.json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Cannot update user." });
    }
};
