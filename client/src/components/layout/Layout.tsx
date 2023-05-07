import React from "react";

import "./layout.css";

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return <div className="layout">{children}</div>;
}
