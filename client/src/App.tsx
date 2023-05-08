import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import LoginPage from "./pages/login/Login";
import SignUpPage from "./pages/signup/SignUp";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import ContactsPage from "./pages/contacts/ContactsPage";
import { IProfile } from "./ts/interfaces/IProfile";
import { Socket, io } from "socket.io-client";
import { AppContext } from "./AppContext";
import Loader from "./components/loader/Loader";

function App() {
    const [user, setUser] = useState<IProfile | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);

            if (!user) {
                const res = await fetch(
                    "http://localhost:3001/auth/check-session",
                    {
                        credentials: "include",
                        method: "POST",
                    }
                );

                if (res.ok) {
                    const user = await res.json();

                    setUser(user);
                    setSocket(
                        io("ws://localhost:3001/", { withCredentials: true })
                    );
                }
            }

            setIsLoading(false);
        };

        checkSession();
    }, [user]);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                socket,
                setSocket,
                isLoading,
                setIsLoading,
            }}
        >
            {isLoading && <Loader />}
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/" element={<ContactsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;
