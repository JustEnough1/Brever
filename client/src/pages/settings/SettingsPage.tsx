import React, { ChangeEvent, useContext, useState } from "react";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import { AppContext } from "../../AppContext";
import Layout from "../../components/layout/Layout";
import NavigationMenu from "../../components/navigationMenu/navigationMenu";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { IProfile } from "../../ts/interfaces/IProfile";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function SettingsPage({}: Props) {
    useRequireLogin();
    const { user, setUser } = useContext(AppContext);
    let [firstname, setFirstname] = useState(user?.first_name);
    let [lastname, setLastname] = useState(user?.last_name);
    let [username, setUsername] = useState(user?.username);
    let [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    let [avatar, setAvatar] = useState(null);
    let [password, setPassword] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleFirstnameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstname(event.target.value);
    };

    const handleLastnameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastname(event.target.value);
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleAvatarChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedAvatar(URL.createObjectURL(file));

        setAvatar(file);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            if (avatar) formData.append("avatar", avatar);

            if (username && username !== user?.username)
                formData.append("username", username);

            if (firstname && firstname !== user?.first_name)
                formData.append("first_name", firstname);

            if (lastname && lastname !== user?.last_name)
                formData.append("last_name", lastname);

            if (password) formData.append("password", password);

            const response = await fetch("http://localhost:3001/users", {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                const profile: IProfile = await response.json();
                setUser(profile);
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleLogout = async () => {
        const response = await fetch("http://localhost:3001/auth/logout", {
            credentials: "include",
            method: "POST",
        });

        navigate("/login");
    };

    const handleDeleteUser = async () => {
        const result = window.confirm("Are you sure you want to proceed?");

        if (result) {
            const response = await fetch("http://localhost:3001/users/", {
                credentials: "include",
                method: "DELETE",
            });

            setUser(null);
            navigate("/login");
        }
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <>
            {user && (
                <Layout>
                    <div className="wrapper text-white border-b border-gray-600">
                        <div className="h-full relative flex items-center">
                            <h2>Settings</h2>
                        </div>
                    </div>
                    <div className="wrapper text-white  overflow-scroll">
                        <div className="my-5 border-b border-gray-600 py-5">
                            <h4 className="pb-5">Users info</h4>
                            <div className="flex flex-col justify-center items-center">
                                <div className="w-3/6">
                                    <div className="pb-5 flex flex-col justify-center items-center">
                                        <label htmlFor="avatarInput">
                                            <img
                                                className="w-36 h-36 rounded-full mb-2 cursor-pointer object-cover"
                                                src={
                                                    selectedAvatar
                                                        ? selectedAvatar
                                                        : `http://localhost:3001/images/avatars/${user.avatar}`
                                                }
                                                alt="avatar"
                                            />
                                            <p className="text-center cursor-pointer">
                                                Upload avatar
                                            </p>
                                        </label>
                                        <input
                                            id="avatarInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-y-2">
                                        <small className="my-5">
                                            Fill in all the fields You want to
                                            change
                                        </small>
                                        <Input
                                            placeholder={user.first_name}
                                            changeHandler={
                                                handleFirstnameChange
                                            }
                                        />
                                        <Input
                                            placeholder={user.last_name}
                                            changeHandler={handleLastnameChange}
                                        />
                                        <hr className="my-5" />
                                        <Input
                                            placeholder={user.username}
                                            changeHandler={handleUsernameChange}
                                        />
                                        <Input
                                            placeholder={
                                                "Enter Your new password"
                                            }
                                            type="password"
                                            changeHandler={handlePasswordChange}
                                        />
                                        <Button
                                            text="Update info"
                                            type="submit"
                                            onClick={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-5 border-b border-gray-600 py-5">
                            <h4 className="pb-5">Actions</h4>
                            <div className="flex gap-x-10">
                                <Button text="Logout" onClick={handleLogout} />
                                <Button
                                    isDanger={true}
                                    text="Delete account"
                                    onClick={handleDeleteUser}
                                />
                            </div>
                        </div>
                    </div>
                    <NavigationMenu />
                </Layout>
            )}
        </>
    );
}
