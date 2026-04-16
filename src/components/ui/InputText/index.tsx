import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

interface InputTextProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "style" | "className" | "rows"> {
    onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
    icon?: IconSvgElement;
    height?: number | string;
}

const InputText = ({ onChange, icon, height = 128, ...props }: InputTextProps) => {
    const resolvedHeight = typeof height === "number" ? `${height}px` : height;

    return (
        <div className="flex items-start gap-3 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5 transition-colors focus-within:border-cloud-500 focus-within:text-cloud-500 focus-within:font-semibold">
            {icon && (
                <div className="rounded-2xl bg-cloud-300/80 p-2 mt-0.5">
                    <HugeiconsIcon
                        icon={icon}
                        className="shrink-0 text-cloud-500"
                        size={26}
                    />
                </div>
            )}

            <textarea
                onChange={(event) => onChange?.(event.target.value, event)}
                style={{ height: resolvedHeight }}
                className="w-full resize-none bg-transparent text-neutral-900 outline-none placeholder:text-neutral-600 font-medium"
                {...props}
            />
        </div>
    );
};

export default InputText;
