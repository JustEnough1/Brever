type Props = {
    text: string;
    type?: "submit" | "button" | "reset";
};

export default function Button({ text, type }: Props) {
    if (!type) type = "button";

    return (
        <button
            className="bg-slate-500 hover:bg-slate-600 text-white rounded-md p-3"
            type={type}
        >
            {text}
        </button>
    );
}
