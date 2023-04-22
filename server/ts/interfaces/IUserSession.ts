import { Session } from "express-session";

export interface IUserSession extends Session {
    userId: number;
}
