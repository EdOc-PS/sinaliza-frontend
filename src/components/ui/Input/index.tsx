import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useState } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    icon?: IconSvgElement;
    noSpecialChars?: boolean;
}

const Input = ({ className = "", onChange, icon, type, noSpecialChars, ...props }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : (type ?? "text");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const isNumber = /[0-9]/.test(e.key);
            const isSpecialKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key);
            if (!isNumber && !isSpecialKey) {
                e.preventDefault();
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        let sanitized = raw;

        if (type === 'number') {
            sanitized = raw.replace(/[^0-9]/g, '');
        } else if (noSpecialChars) {
            sanitized = raw.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '');
        }

        onChange?.(sanitized, event);
    };

    return (
        <>
            <style>{`
                input[type='number']::-webkit-outer-spin-button,
                input[type='number']::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type='number'] {
                    -moz-appearance: textfield;
                }
            `}</style>

            <div className="flex items-center gap-3 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5 transition-colors focus-within:font-semibold focus-within:border-cloud-500 focus-within:text-cloud-500 ">
                {icon && (
                    <div className="rounded-2xl bg-cloud-300/80 p-2">
                        <HugeiconsIcon
                            icon={icon}
                            className="shrink-0 text-cloud-500"
                            size={26}
                        />
                    </div>
                )}

                <input
                    type={inputType}
                    className={`w-full bg-transparent text-neutral-900 outline-none placeholder:text-neutral-600 ${className}`}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    {...props}
                />

                {isPassword && (
                    <button type="button" className="mr-1.5 cursor-pointer" onClick={() => setShowPassword((value) => !value)}>
                        {!showPassword ? (
                            <HugeiconsIcon
                                icon={ViewIcon}
                                className="shrink-0 text-cloud-500"
                                size={26}
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={ViewOffIcon}
                                className="shrink-0 text-cloud-500"
                                size={26}
                            />
                        )}
                    </button>
                )}
            </div>
        </>
    )
}

export default Input;
