import { Request, Response, NextFunction } from "express";
import { IUserSession } from "../ts/interfaces/IUserSession";

export async function checkSessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const session = req.session as IUserSession;

        if (!session.userId) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        return res.status(500);
    }
}
