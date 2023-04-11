import { Request, Response, NextFunction } from "express";

export function validateUsername(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { username } = req.body;

    if (!(username.length > 0 && username.length < 50))
        return res
            .status(400)
            .json({
                message: "Username length must be between 1 - 50 characters",
            });

    next();
}
