import { Request, Response, NextFunction } from "express";
import { IUserSession } from "../ts/interfaces/IUserSession";
import { Socket } from "socket.io";

// Промежуточный обработчик, обеспечивающий наличие сессии
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

// Промежуточный обработчик, обеспечивающий наличие сессии в сокете
export async function checkSocketSessionMiddleware(
    socket: Socket,
    next: NextFunction
) {
    try {
        const session = socket.request.session as IUserSession;

        if (!session.userId) {
            return socket.emit("error", { message: "Unauthorized" });
        }

        next();
    } catch (error) {
        return socket.emit("error", { message: "Error" });
    }
}
