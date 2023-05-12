import React, { MouseEventHandler } from "react";
import { IProfile } from "../../ts/interfaces/IProfile";

type Props = {
    callback?: {
        handleClick: Function;
        params?: any;
    };
    profile: IProfile;
    lastMessage?: {
        message: string;
        time: string;
    };
    handleAccept?: Function;
    handleDecline?: Function;
    handleSendFriendRequest?: Function;
};

export default function Contact({
    profile,
    lastMessage,
    callback,
    handleAccept,
    handleDecline,
    handleSendFriendRequest,
}: Props) {
    return (
        <div
            className="flex items-center p-3 border-b border-gray-600 hover:bg-zinc-600"
            onClick={() => {
                callback?.handleClick && callback.handleClick(callback.params);
            }}
        >
            <img
                className="w-12 h-12 rounded-full object-cover mr-4"
                src={`http://localhost:3001/images/avatars/${profile.avatar}`}
                alt="avatar"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg truncate">
                        {profile.first_name + " " + profile.last_name}
                    </h2>
                    <p className="text-gray-400 text-sm">{lastMessage?.time}</p>
                </div>
                <p className="text-gray-500 truncate">{lastMessage?.message}</p>
            </div>
            {handleAccept && handleDecline && (
                <div className="text-white flex gap-x-5">
                    <button onClick={() => handleAccept(profile.id)}>
                        Accept
                    </button>
                    <button onClick={() => handleDecline(profile.id)}>
                        Decline
                    </button>
                </div>
            )}
            {handleSendFriendRequest && (
                <div className="text-white">
                    <button onClick={() => handleSendFriendRequest(profile.id)}>
                        Send friend request
                    </button>
                </div>
            )}
        </div>
    );
}
