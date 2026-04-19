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

    return (
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
                className={`w-full  bg-transparent text-neutral-900 outline-none placeholder:text-neutral-600 ${className}`}
                onChange={(event) => {
                    const raw = event.target.value;
                    const sanitized = noSpecialChars
                        ? raw.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '')
                        : raw;
                    onChange?.(sanitized, event);
                }}
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
    )
}

export default Input;
