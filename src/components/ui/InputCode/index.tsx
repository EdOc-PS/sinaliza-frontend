import { useRef } from "react";

interface InputCodeProps {
    digits: string[];
    onChange: (digits: string[]) => void;
    length?: number;
}

export const InputCode = ({ digits, onChange, length = 6 }: InputCodeProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

        if (sanitized.length > 1) return;

        const newDigits = [...digits];
        newDigits[index] = sanitized;
        onChange(newDigits);

        if (sanitized && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "Tab" && digits[index] && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2 sm:gap-3 justify-center w-full">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digits[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`caret-transparent flex-1 min-w-0 max-w-14 h-12 sm:h-14 text-center text-base sm:text-lg font-bold rounded-2xl border-2 transition-all focus:outline-none ${
                        digits[index]
                            ? "border-lime-400 bg-lime-50"
                            : "border-neutral-300 bg-white hover:border-neutral-400 focus:border-lime-400"
                    }`}
                    placeholder="-"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
};
