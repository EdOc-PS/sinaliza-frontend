import { useRef, useState } from "react";
import { Cancel02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface CheckInputProps {
    id?: string;
    icon?: IconSvgElement;
    placeholder?: string;
    tags: string[];
    onChange: (tags: string[]) => void;
}

const InputCheck = ({ id, icon, placeholder = "Adicionar tag e pressionar Enter...", tags, onChange }: CheckInputProps) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (raw: string) => {
        const trimmed = raw.trim().toLowerCase();
        if (!trimmed || tags.includes(trimmed)) return;
        onChange([...tags, trimmed]);
        setInputValue("");
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter(t => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    return (
        <div
            className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5
                transition-colors focus-within:border-cloud-500 cursor-text min-h-13"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Ícone */}
            {icon && (
                <div className="rounded-2xl bg-cloud-300/80 p-2 shrink-0">
                    <HugeiconsIcon icon={icon} className="shrink-0 text-cloud-500" size={26} />
                </div>
            )}

            {/* Tags */}
            {tags.map(tag => (
                <span
                    key={tag}
                    className="flex flex-row-reverse items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-lime-200 text-lime-800"
                >
                    {tag}
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); removeTag(tag); }}
                        className="cursor-pointer text-lime-700 hover:text-lime-900"
                    >
                        <HugeiconsIcon icon={Cancel02Icon} size={18} />
                    </button>
                </span>
            ))}

            {/* Input inline */}
            <input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                placeholder={tags.length === 0 ? placeholder : ""}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
                className="flex-1 min-w-30 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-600"
            />
        </div>
    );
};

export default InputCheck;
