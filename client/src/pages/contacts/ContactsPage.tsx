import Layout from "../../components/layout/Layout";
import Input from "../../components/input/Input";
import ContactList from "../../components/contactList/ContactList";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import NavigationMenu from "../../components/navigationMenu/navigationMenu";

type Props = {};

export default function ContactsPage({}: Props) {
    useRequireLogin();
    const { user, socket, setIsLoading, isLoading } = useContext(AppContext);
    let [contacts, setContacts] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        socket?.emit("get_contacts");

        socket?.on("get_contacts", (contacts) => {
            setContacts(contacts);
            setIsLoading(false);
        });

        return () => {
            socket?.off("get_contacts");
        };
    }, [socket]);

    return (
        <>
            {user && (
                <Layout>
                    <div className="wrapper">
                        <div className="h-full flex justify-center items-center">
                            <Input
                                placeholder={"Search"}
                                type="search"
                                width="50%"
                            />
                        </div>
                    </div>
                    {!isLoading && (
                        <ContactList
                            contacts={
                                contacts.length > 0
                                    ? contacts.map((contact) => ({
                                          profile: contact,
                                      }))
                                    : []
                            }
                        />
                    )}

                    <NavigationMenu />
                </Layout>
            )}
        </>
    );
}
