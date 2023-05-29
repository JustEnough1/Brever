import { Request, Response, NextFunction } from "express";

// Промежуточный обработчик, валидирующий имя пользователя
export function validateUsernameMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { username } = req.body;

    if (!(username.length >= 5 && username.length < 50))
        return res.status(400).json({
            message: "Username length must be between 5 - 50 characters",
        });

    next();
}
