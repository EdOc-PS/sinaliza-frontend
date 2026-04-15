import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    icon: IconSvgElement;
}

const Input = ({ className = "", onChange, icon, ...props }: InputProps) => {
    return (
        <div className="flex items-center gap-3 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5 transition-colors focus-within:font-semibold focus-within:border-cloud-500 focus-within:text-cloud-500 ">

            <div className="p-2 rounded-2xl bg-cloud-300/80 ">
                <HugeiconsIcon
                    icon={icon}
                    className="shrink-0 text-cloud-500"
                    size={26}
                />
            </div>

            <input
                type="text"
                className={`w-full  bg-transparent text-neutral-900 outline-none placeholder:text-neutral-600 ${className}`}
                onChange={(event) => onChange?.(event.target.value, event)}
                {...props}
            />
        </div>
    )
}

export default Input;
