import React from "react";

import "./navigationMenu.css";
import { Link } from "react-router-dom";

type Props = {};

export default function NavigationMenu({}: Props) {
    return (
        <div className="wrapper flex items-center justify-center text-white">
            <div className="navigation-menu h-full flex items-center justify-evenly rounded-full mb-5">
                <Link to="/">
                    <i className="bi bi-people-fill"></i>
                </Link>

                <Link to="/requests">
                    <i className="bi bi-person-fill-add"></i>
                </Link>

                <Link to="/settings">
                    <i className="bi bi-gear-fill"></i>
                </Link>
            </div>
        </div>
    );
}
