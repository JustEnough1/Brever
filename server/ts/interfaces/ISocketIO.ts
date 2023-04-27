import { IUserSession } from "./IUserSession";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    error: (error: { message: string }) => void;
    get_contacts: (contacts: IProfile[]) => void;
    send_friend_request: (data: { friend: IProfile }) => void;
    accept_friend_request: (data: { friend: IProfile }) => void;
}

export interface ClientToServerEvents {
    get_contacts: () => void;
    send_friend_request: (data: { friendId: number }) => void;
    accept_friend_request: (data: { friendId: number }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}

declare module "http" {
    interface IncomingMessage {
        session: IUserSession & {
            authenticated: boolean;
        };
    }
}
