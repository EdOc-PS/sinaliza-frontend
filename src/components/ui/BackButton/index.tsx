import type { ButtonHTMLAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: number;
}

// Botão de voltar usado entre steps de formulários multi-step (modais de sinal, conta, register)
const BackButton = ({ className = "", size = 26, type = "button", ...props }: BackButtonProps) => (
    <button
        type={type}
        className={`flex w-16 cursor-pointer items-center justify-center rounded-3xl bg-cloud-300/80 p-2 transition-colors hover:bg-cloud-400/60 ${className}`}
        {...props}
    >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={size} />
    </button>
);

export default BackButton;
