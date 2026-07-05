import type { ButtonHTMLAttributes } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Spinner from "../Spinner";

type ButtonVariant = "cloud" | "lime" | "sky" | "campfire" | "salmon" | "outline" | "error";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
    loadingText?: string;
    icon?: IconSvgElement;
    iconPosition?: "left" | "right";
    iconSize?: number;
}

const variantStyles: Record<ButtonVariant, string> = {
    cloud:    "bg-cloud-500 text-cloud-100 hover:bg-cloud-500/90",
    lime:     "bg-lime-500 text-lime-100 hover:bg-lime-500/90",
    sky:      "bg-sky-500 text-sky-100 hover:bg-sky-500/90",
    campfire: "bg-campfire-500 text-campfire-100 hover:bg-campfire-500/90",
    salmon:   "bg-salmon-500 text-white hover:bg-salmon-500/90",
    outline:  "border-2 border-cloud-500 bg-transparent text-cloud-500 hover:bg-cloud-100",
    error:    "bg-error-600 text-white hover:bg-error-600/90",
};

const Button = ({
    className = "",
    variant = "cloud",
    type = "button",
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    iconSize = 20,
    children,
    disabled,
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || loading;
    const iconEl = icon ? <HugeiconsIcon icon={icon} size={iconSize} className="shrink-0" /> : null;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={`
                cursor-pointer flex h-16 items-center gap-2 rounded-3xl px-6 text-base font-bold
                transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60
                ${loading ? "justify-between" : "justify-center"}
                ${variantStyles[variant]} ${className}
            `}
            {...props}
        >
            {loading ? (
                <>
                    <span>{loadingText ?? children}</span>
                    <Spinner />
                </>
            ) : (
                <>
                    {icon && iconPosition === "left" && iconEl}
                    {children}
                    {icon && iconPosition === "right" && iconEl}
                </>
            )}
        </button>
    );
};

export default Button;
