import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type Props = {
    placeholder: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
    width?: string;
    changeHandler?: ChangeEventHandler<HTMLInputElement>;
};

export default function Input({
    placeholder,
    changeHandler,
    value,
    type,
    width,
}: Props) {
    return (
        <input
            className={`text-white rounded p-2`}
            style={{
                backgroundColor: "#202020",
                width: width ? width : "auto",
            }}
            type={type ? type : "text"}
            value={value}
            placeholder={placeholder}
            onChange={changeHandler}
        />
    );
}
