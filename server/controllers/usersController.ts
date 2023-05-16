import { Request, Response } from "express";
import { IUserSession } from "../ts/interfaces/IUserSession";
import { UserModel } from "../models/User";
import { upload } from "../server";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const session = req.session as IUserSession;

        upload(req, res, async (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Error uploading file" });
            }

            const { username, password, first_name, last_name } = req.body;
            const avatar = req.file ? req.file.filename : undefined;

            await UserModel.update(session.userId, {
                username,
                password,
                first_name,
                last_name,
                avatar,
            });

            const profile: IProfile = UserModel.getProfileFromUser(
                await UserModel.findById(req.session.userId)
            );

            res.json(profile);
        });
    } catch (error) {
        res.status(500).json({ message: "Cannot update user." });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
        const { searchValue } = req.query;

        if (!searchValue)
            return res
                .status(400)
                .json({ message: "Please, provide search value." });

        const matchedUsers = await UserModel.findBySearchValue(
            searchValue as string,
            req.session.userId
        );

        res.json({ matchedUsers });
    } catch (error) {
        res.status(500).json({ message: "Cannot search users." });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await UserModel.delete(req.session.userId);

        res.clearCookie("connect.sid", { path: "/" });

        res.json({ message: "User has been deleted." });
    } catch (error) {
        res.status(500).json({ message: "Cannot delete user." });
    }
};
