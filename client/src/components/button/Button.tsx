type Props = {
    text: string;
    type?: "submit" | "button" | "reset";
    onClick?: Function;
    isDanger?: boolean;
};

export default function Button({ text, type, onClick, isDanger }: Props) {
    if (!type) type = "button";

    return (
        <button
            className={`${
                isDanger
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-slate-500 hover:bg-slate-600"
            } text-white rounded-md p-3`}
            type={type}
            onClick={() => {
                if (onClick) onClick();
            }}
        >
            {text}
        </button>
    );
}
