import type { ButtonHTMLAttributes } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Spinner from "../Spinner";

type ButtonVariant =
    | "cloud" | "lime" | "sky" | "campfire" | "salmon" | "outline" | "error"
    // Variantes para uso sobre fundo escuro (ex: CTA da landing)
    | "white" | "outlineWhite";

type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    /** `md` (padrão) para formulários e CTAs; `sm` para barras compactas como o header */
    size?: ButtonSize;
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
    // Preenche no hover: o antigo hover:bg-cloud-100 era invisível sobre fundo claro
    outline:  "border-2 border-cloud-500 bg-transparent text-cloud-500 hover:bg-cloud-500 hover:text-cloud-100",
    error:    "bg-error-600 text-white hover:bg-error-600/90",
    white:        "bg-white text-cloud-500 hover:bg-cloud-100",
    outlineWhite: "border-2 border-white/40 bg-transparent text-white hover:border-white/70 hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-12 px-5 text-sm rounded-2xl",
    md: "h-16 px-6 text-base rounded-3xl",
};

const Button = ({
    className = "",
    variant = "cloud",
    size = "md",
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
                cursor-pointer flex items-center gap-2 font-bold
                transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60
                ${loading ? "justify-between" : "justify-center"}
                ${sizeStyles[size]} ${variantStyles[variant]} ${className}
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
