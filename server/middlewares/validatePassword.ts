import { Request, Response, NextFunction } from "express";

export function validatePassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { password } = req.body;

    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,255}$/;

    if (!passwordRegEx.test(password))
        return res.status(400).json({
            message: "Invalid password format.",
        });

    next();
}
