import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import { IProfile } from "./ts/interfaces/IProfile";

type ContextProps = {
    user: IProfile | null;
    setUser: (user: IProfile | null) => void;
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
    isLoading: boolean;
    setIsLoading: (bool: boolean) => void;
};

export const AppContext = createContext<ContextProps>({
    user: null,
    setUser: () => {},
    socket: null,
    setSocket: () => {},
    isLoading: false,
    setIsLoading: () => {},
});
