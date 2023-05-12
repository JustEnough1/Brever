import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import Layout from "../../components/layout/Layout";
import Input from "../../components/input/Input";
import NavigationMenu from "../../components/navigationMenu/navigationMenu";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import { IProfile } from "../../ts/interfaces/IProfile";
import Contact from "../../components/contact/Contact";

type Props = {};

export default function RequestsPage({}: Props) {
    useRequireLogin();
    const { user, socket } = useContext(AppContext);
    let [requests, setRequests] = useState<IProfile[]>([]);
    let [searchValue, setSearchValue] = useState("");
    let [searchResults, setSearchResults] = useState<IProfile[]>([]);
    const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout>();

    const acceptRequest = (friendId: number) => {
        socket?.emit("accept_friend_request", { friendId });
        socket?.emit("get_requests", {});
    };
    const declineRequest = (friendId: number) => {
        socket?.emit("decline_friend_request", { friendId });
        socket?.emit("get_requests", {});
    };

    const delayedSearch = (value: string) => {
        clearTimeout(searchTimeoutId);
        setSearchTimeoutId(setTimeout(() => searchUsers(value), 1000));
    };

    const searchUsers = async (value: string) => {
        const response = await fetch(
            `http://localhost:3001/users/?searchValue=${value}`,
            {
                credentials: "include",
            }
        );
        const users = await response.json();
        setSearchResults(users.matchedUsers);
    };

    const handleSendFriendRequest = (friendId: number) => {
        socket?.emit("send_friend_request", { friendId });
        setSearchResults(
            searchResults.filter((profile) => profile.id !== friendId)
        );
    };

    useEffect(() => {
        socket?.emit("get_requests", {});

        socket?.on("get_requests", (requests: IProfile[]) => {
            setRequests(requests);
        });
    }, []);

    return (
        <>
            {user && (
                <Layout>
                    <div className="wrapper">
                        <div className="h-full relative flex justify-center items-center">
                            <Input
                                placeholder={"Search people"}
                                type="search"
                                width="50%"
                                changeHandler={(event) => {
                                    if (event.target.value === "") {
                                        clearTimeout(searchTimeoutId);
                                        return setSearchResults([]);
                                    }
                                    setSearchValue(event.target.value);
                                    delayedSearch(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="wrapper">
                        {searchResults.length !== 0 ? (
                            <div className="my-2">
                                <h3 className="text-white">Search results</h3>

                                {searchResults.map((profile) => {
                                    return (
                                        <Contact
                                            profile={profile}
                                            handleSendFriendRequest={
                                                handleSendFriendRequest
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ) : null}

                        <div className="my-2">
                            <h3 className="text-white">Friendship requests</h3>
                            {requests.length === 0 && (
                                <h6 className="text-zinc-500">
                                    No friendship requests
                                </h6>
                            )}
                            {requests.map((request) => {
                                return (
                                    <Contact
                                        profile={request}
                                        handleAccept={acceptRequest}
                                        handleDecline={declineRequest}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <NavigationMenu />
                </Layout>
            )}
        </>
    );
}
