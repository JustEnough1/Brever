import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import logo from "../../logo.svg";
import bg from "./bg_curve.svg";
import { AppContext } from "../../AppContext";
import { io } from "socket.io-client";

export default function SignUpPage() {
    const { setSocket, setUser } = useContext(AppContext);
    let [step, setStep] = useState(1);
    let [firstname, setFirstname] = useState("");
    let [lastname, setLastname] = useState("");
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleNextStep = () => {
        if (firstname.length <= 0)
            return alert("Please, enter Your firstname.");
        if (firstname.length > 255) return alert("Your firstname is too long.");
        if (lastname.length <= 0) return alert("Please, enter Your lastname.");
        if (lastname.length <= 0) return alert("Your lastname is too long.");

        setStep(2);
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    const handleFirstnameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstname(event.target.value);
    };

    const handleLastnameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastname(event.target.value);
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname,
                lastname,
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);
            setSocket(io("ws://localhost:3001/", { withCredentials: true }));
            navigate("/login");
        } else {
            console.error("Registration failed.");
            const data = await response.json();
            alert(data.message);
        }
    };
    return (
        <form
            className="login h-full flex items-center justify-center "
            onSubmit={handleSubmit}
        >
            <div className="wrapper flex flex-col items-center z-10">
                <img src={logo} alt="logo" className="w-48 pb-3" />

                <h4 className="text-white pb-8">Sign up</h4>

                <div className="flex flex-col gap-y-2.5 pb-8">
                    {step === 1 && (
                        <>
                            <Input
                                placeholder={"Firstname"}
                                value={firstname}
                                changeHandler={handleFirstnameChange}
                            />
                            <Input
                                placeholder={"Lastname"}
                                value={lastname}
                                changeHandler={handleLastnameChange}
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                placeholder={"Username"}
                                value={username}
                                changeHandler={handleUsernameChange}
                            />
                            <Input
                                placeholder={"Password"}
                                value={password}
                                type="password"
                                changeHandler={handlePasswordChange}
                            />
                            <small className="text-slate-300">
                                Password must contain at least 1 uppercase
                                letter
                                <br /> and at least 1 number
                            </small>
                        </>
                    )}
                </div>

                <div className="flex flex-col justify-center gap-y-2">
                    {step === 1 && (
                        <Button
                            text="Next step"
                            onClick={handleNextStep}
                            type="button"
                        />
                    )}
                    {step === 2 && (
                        <div className="flex justify-center gap-x-2">
                            <Button
                                text="Go back"
                                onClick={handlePreviousStep}
                                type="button"
                            />
                            <Button text="Sign up" type="submit" />
                        </div>
                    )}
                    <Link to={"/login"}>
                        <p className="text-slate-200">
                            I already have an account
                        </p>
                    </Link>
                </div>
            </div>
            <img src={bg} className="absolute bottom-0 left-0 w-full" />
        </form>
    );
}
