import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import {
    Link,
    redirect,
    useNavigate,
    useOutletContext,
} from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import logo from "../../logo.svg";
import bg from "./bg_curve.svg";
import { AppContext } from "../../AppContext";
import { IProfile } from "../../ts/interfaces/IProfile";
import { io } from "socket.io-client";

export default function LoginPage() {
    let navigate = useNavigate();
    const { setUser, setSocket } = useContext(AppContext);

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
                credentials: "include",
            });

            if (response.ok) {
                const data: IProfile = await response.json();
                setUser(data);
                setSocket(
                    io("ws://localhost:3001/", { withCredentials: true })
                );

                navigate("/");
            } else {
                console.error("Login failed.");
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <form
            className="h-full flex items-center justify-center "
            onSubmit={handleSubmit}
        >
            <div className="wrapper flex flex-col items-center z-10">
                <img src={logo} alt="logo" className="w-48 pb-3" />

                <h4 className="text-white pb-8">Welcome back</h4>

                <div className="flex flex-col gap-y-2.5 pb-8">
                    <Input
                        placeholder={"Username"}
                        changeHandler={handleUsernameChange}
                    />
                    <Input
                        placeholder={"Password"}
                        type="password"
                        changeHandler={handlePasswordChange}
                    />
                </div>

                <div className="flex flex-col justify-center gap-1">
                    <Button text="Log in" type="submit" />

                    <Link to="/signup">
                        <p className="text-slate-200">
                            I don't have an account
                        </p>
                    </Link>
                </div>
            </div>
            <img src={bg} className="absolute bottom-0 left-0 w-full" />
        </form>
    );
}
