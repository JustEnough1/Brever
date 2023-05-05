import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type Props = {
    placeholder: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
    changeHandler?: ChangeEventHandler<HTMLInputElement>;
};

export default function Input({
    placeholder,
    changeHandler,
    value,
    type,
}: Props) {
    return (
        <input
            className={`text-white rounded p-2`}
            style={{ backgroundColor: "#202020" }}
            type={type ? type : "text"}
            value={value}
            placeholder={placeholder}
            onChange={changeHandler}
        />
    );
}
