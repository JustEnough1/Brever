import React, {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
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
    const { socket, setIsLoading, isLoading } = useContext(AppContext);
    let [newMessage, setNewMessage] = useState("");
    let [messages, setMessages] = useState<IMessage[]>([]);
    let [messagesOffset, setMessagesOffset] = useState(0);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const messagesRef = useRef<HTMLDivElement>(null);

    const sendMessage = (message: string) => {
        const trimmedMessage = message.trim();

        const sanitizedMessage = trimmedMessage
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "")
            .replace(/'/g, "\\'");

        if (sanitizedMessage === "" || sanitizedMessage.length === 0) {
            alert("Message has wrong format.");
            return;
        }
        console.log(sanitizedMessage.length);

        socket?.emit("send_message", {
            receiverId: contact.id,
            message: sanitizedMessage,
        });
    };

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    };

    const fetchMessages = () => {
        setIsLoading(true);
        socket?.emit("fetch_messages", {
            friendId: contact.id,
            offset: messagesOffset,
        });

        setMessagesOffset(messagesOffset + 20);
        setIsLoading(false);
        setPrevScrollHeight(messagesRef.current?.scrollHeight || 0);
    };

    useEffect(() => {
        if (messagesRef.current) {
            if (prevScrollHeight !== messagesRef.current.scrollHeight) {
                const scrollTop =
                    messagesRef.current.scrollHeight - prevScrollHeight;
                messagesRef.current?.scrollBy(0, scrollTop);
            }
        }
    }, [messages]);

    useEffect(() => {
        messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
    }, []);

    useEffect(() => {
        if (contact) {
            fetchMessages();
        }

        socket?.on("send_message", (message: IMessage) => {
            if (
                contact.id === message.sender_id ||
                contact.id === message.receiver_id
            )
                setMessages((prevState) => [...prevState, message]);
        });

        socket?.on("fetch_messages", (messages: IMessage[]) => {
            setMessages((prevState) => [...messages, ...prevState]);
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
                                className="w-12 h-12 rounded-full object-cover mr-4"
                                src={`http://localhost:3001/images/avatars/${contact.avatar}`}
                                alt="avatar"
                            />
                            <h2 className="text-white font-bold text-lg truncate">
                                {contact.first_name + " " + contact.last_name}
                            </h2>
                        </div>
                    </div>
                </div>
                <div
                    ref={messagesRef}
                    className="wrapper text-white overflow-scroll"
                >
                    <div
                        className="flex justify-center p-5 cursor-pointer"
                        onClick={() => fetchMessages()}
                    >
                        <h6>Load more</h6>
                    </div>
                    {messages.map((message, index) => {
                        const date = new Date(message.created_at);
                        const formattedDate = date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        });
                        const formattedTime = date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        message.created_at = `${formattedDate} ${formattedTime}`;
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
