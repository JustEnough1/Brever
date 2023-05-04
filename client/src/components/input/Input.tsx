import React, { ChangeEventHandler } from "react";

type Props = {
    placeholder: string;

    changeHandler?: ChangeEventHandler<HTMLInputElement>;
};

export default function Input({ placeholder, changeHandler }: Props) {
    return (
        <input
            className={`text-white rounded p-2`}
            style={{ backgroundColor: "#202020" }}
            type="text"
            placeholder={placeholder}
            onChange={changeHandler}
        />
    );
}
