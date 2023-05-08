import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type Props = {
    placeholder: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
    width?: string;
    changeHandler?: ChangeEventHandler<HTMLInputElement>;
    classes?: string;
};

export default function Input({
    placeholder,
    changeHandler,
    value,
    type,
    width,
    classes,
}: Props) {
    return (
        <input
            className={`text-white rounded p-2 ${classes}`}
            style={{
                backgroundColor: "#202020",

                width: width ? width : "",
            }}
            type={type ? type : "text"}
            value={value}
            placeholder={placeholder}
            onChange={changeHandler}
        />
    );
}
