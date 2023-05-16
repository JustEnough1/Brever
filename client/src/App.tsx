import React, { useEffect, useState } from "react";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/signup/SignUpPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ContactsPage from "./pages/contacts/ContactsPage";
import { IProfile } from "./ts/interfaces/IProfile";
import { Socket, io } from "socket.io-client";
import { AppContext } from "./AppContext";
import Loader from "./components/loader/Loader";
import RequestsPage from "./pages/requests/RequestsPage";
import SettingsPage from "./pages/settings/SettingsPage";

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
                    <Route path="/requests" element={<RequestsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;
