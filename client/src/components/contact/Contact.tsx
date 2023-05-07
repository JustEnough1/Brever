import React from "react";
import { IProfile } from "../../ts/interfaces/IProfile";

type Props = {
    profile: IProfile;
    lastMessage?: {
        message: string;
        time: string;
    };
};

export default function Contact({ profile, lastMessage }: Props) {
    return (
        <div className="flex items-center p-3 border-b border-gray-600 hover:bg-zinc-600">
            <img
                className="w-12 h-12 rounded-full mr-4"
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
        </div>
    );
}
