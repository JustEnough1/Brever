import React, { useEffect, useState } from "react";
import Contact from "../contact/Contact";
import { IProfile } from "../../ts/interfaces/IProfile";

type Props = {
    contacts: {
        profile: IProfile;
        lastMessage?: {
            message: string;
            time: string;
        };
    }[];
};

export default function ContactList({ contacts }: Props) {
    const [localContacts, setLocalContacts] = useState(contacts);

    useEffect(() => {
        setLocalContacts(contacts);
    }, [contacts]);

    if (contacts.length === 0)
        return (
            <div className="wrapper flex justify-center items-center">
                <h2 className="text-zinc-500 text-center">
                    No contacts to display
                </h2>
            </div>
        );

    return (
        <div className="wrapper text-white overflow-scroll">
            {localContacts.map((contact) => {
                return (
                    <Contact
                        profile={contact.profile}
                        lastMessage={contact.lastMessage}
                        key={contact.profile.id}
                    />
                );
            })}
        </div>
    );
}
