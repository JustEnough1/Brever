import React, { useContext, useEffect } from "react";
import { IProfile } from "../../ts/interfaces/IProfile";
import { IMessage } from "../../ts/interfaces/IMessage";
import { AppContext } from "../../AppContext";

type Props = {
    message: IMessage;
};

export default function Message({ message }: Props) {
    const { user } = useContext(AppContext);

    const isSentByCurrentUser = message.sender_id === user?.id;

    return (
        <>
            <div
                style={{
                    background: isSentByCurrentUser
                        ? "#6D7387"
                        : "rgb(136 144 169)",
                }}
                className={`p-3 m-3 max-w-xs rounded ${
                    isSentByCurrentUser ? "ml-auto" : "mr-auto"
                }`}
            >
                <p className="break-words">{message.message}</p>
                <small
                    className={`text-right ${
                        isSentByCurrentUser ? "ml-auto" : "mr-auto"
                    }`}
                >
                    {message.created_at}
                </small>
            </div>
        </>
    );
}
