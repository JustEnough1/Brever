import React, { ChangeEvent, FormEvent, useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import logo from "../../logo.svg";
import bg from "./bg_curve.svg";

import "./login.css";

export default function LoginPage() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error("Login failed.");
        }
    };

    return (
        <form
            className="login h-full flex items-center justify-center"
            onSubmit={handleSubmit}
        >
            <div className="wrapper flex flex-col items-center">
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
                    <p className="text-slate-200">I don't have an account</p>
                </div>
            </div>
            <img src={bg} className="absolute bottom-0 left-0 w-full" />
        </form>
    );
}
