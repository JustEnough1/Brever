import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Message from "../message/Message";
import { IProfile } from "../../ts/interfaces/IProfile";
import { AppContext } from "../../AppContext";
import { IMessage } from "../../ts/interfaces/IMessage";
import Input from "../input/Input";

type Props = {
    contact: IProfile;
    setChatWith: Function;
};

export default function Chat({ contact, setChatWith }: Props) {
    const { socket } = useContext(AppContext);
    let [newMessage, setNewMessage] = useState("");
    let [messages, setMessages] = useState<IMessage[]>([]);

    const sendMessage = (message: string) => {
        socket?.emit("send_message", { receiverId: contact.id, message });
    };

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };

    useEffect(() => {
        if (contact) {
            socket?.emit("fetch_messages", {
                friendId: contact.id,
                offset: 0,
            });
        }

        socket?.on("send_message", (message: IMessage) => {
            if (
                contact.id === message.sender_id ||
                contact.id === message.receiver_id
            )
                setMessages((prevState) => [...prevState, message]);
        });

        socket?.on("fetch_messages", (messages: IMessage[]) => {
            setMessages(messages);
        });
    }, [contact]);

    return (
        <div
            className="absolute left-0 top-0 w-screen h-screen z-10"
            style={{ backgroundColor: "#2d2d2d" }}
        >
            <Layout>
                <div style={{ backgroundColor: "#202020" }}>
                    <div className="wrapper h-full flex items-center gap-x-5 ">
                        <i
                            className="bi bi-arrow-left-short text-white text-5xl"
                            onClick={() => setChatWith(null)}
                        ></i>
                        <div className="flex items-center">
                            <img
                                className="w-12 h-12 rounded-full mr-4"
                                src={`http://localhost:3001/images/avatars/${contact.avatar}`}
                                alt="avatar"
                            />
                            <h2 className="text-white font-bold text-lg truncate">
                                {contact.first_name + " " + contact.last_name}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="wrapper text-white overflow-scroll">
                    {messages.map((message, index) => {
                        const date = new Date(message.created_at);
                        message.created_at = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                        )}`;
                        return <Message key={index} message={message} />;
                    })}
                </div>
                <div className="wrapper text-white w-full flex items-center">
                    <Input
                        placeholder={"Type here"}
                        classes="w-4/5"
                        changeHandler={handleMessageChange}
                        value={newMessage}
                    />
                    <button
                        className="w-1/5 p-2 rounded"
                        style={{ background: "#6D7387" }}
                        onClick={() => {
                            sendMessage(newMessage);
                            setNewMessage("");
                        }}
                    >
                        Send
                    </button>
                </div>
            </Layout>
        </div>
    );
}
