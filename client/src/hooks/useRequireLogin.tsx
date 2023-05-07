import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

export const useRequireLogin = () => {
    const { user, isLoading } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading === false && !user) {
            navigate("/login");
        }

        return () => {};
    }, [isLoading, navigate, user]);
};
