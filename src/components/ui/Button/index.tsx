import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "cloud" | "lime" | "sky" | "campfire" | "salmon" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
    cloud: "bg-cloud-500 text-cloud-100 hover:bg-cloud-500/90",
    lime: "bg-lime-500 text-lime-100 hover:bg-lime-500/90",
    sky: "bg-sky-500 text-sky-100 hover:bg-sky-500/90",
    campfire: "bg-campfire-500 text-campfire-100 hover:bg-campfire-500/90",
    salmon: "bg-salmon-500 text-salmon-100 hover:bg-salmon-500/90",
    outline: "border-2 border-cloud-500 bg-transparent text-cloud-500 hover:bg-cloud-100",
};

const Button = ({ className = "", variant = "cloud", type = "button", ...props }: ButtonProps) => {
    return (
        <button
            type={type}
            className={`cursor-pointer flex h-16 items-center justify-center rounded-3xl px-6 text-base font-bold transition-colors duration-200 
                disabled:cursor-not-allowed disabled:opacity-60 
                ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
};

export default Button;
