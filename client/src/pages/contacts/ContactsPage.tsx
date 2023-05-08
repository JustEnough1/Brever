import Layout from "../../components/layout/Layout";
import Input from "../../components/input/Input";
import ContactList from "../../components/contactList/ContactList";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import NavigationMenu from "../../components/navigationMenu/navigationMenu";
import { IProfile } from "../../ts/interfaces/IProfile";

type Props = {};

export default function ContactsPage({}: Props) {
    useRequireLogin();
    const { user, socket, setIsLoading, isLoading } = useContext(AppContext);
    let [contacts, setContacts] = useState<IProfile[]>([]);

    const filterContacts = (event: ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.toLowerCase();
        const sortedContacts = [...contacts].sort((a, b) => {
            if (
                a.first_name.toLowerCase().startsWith(searchValue) &&
                !b.first_name.toLowerCase().startsWith(searchValue)
            ) {
                return -1;
            } else if (
                !a.first_name.toLowerCase().startsWith(searchValue) &&
                b.first_name.toLowerCase().startsWith(searchValue)
            ) {
                return 1;
            } else {
                return 0;
            }
        });
        setContacts(sortedContacts);
    };

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
                        <div className="h-full relative flex justify-center items-center">
                            <Input
                                placeholder={"Search"}
                                type="search"
                                width="50%"
                                changeHandler={filterContacts}
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
