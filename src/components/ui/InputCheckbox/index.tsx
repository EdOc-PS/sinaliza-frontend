import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Tick04Icon } from "@hugeicons/core-free-icons";

interface InputCheckboxProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    title: string;
    description?: string;
    icon?: IconSvgElement;
    disabled?: boolean;
}

const InputCheckbox = ({ id, checked, onChange, title, description, icon, disabled = false }: InputCheckboxProps) => {
    return (
        <button
            id={id}
            type="button"
            role="checkbox"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-3xl border-2 px-3.5 py-3 text-left transition-all
                disabled:cursor-not-allowed disabled:opacity-60
                ${checked ? "border-cloud-500/40 bg-cloud-100" : "border-cloud-400/10 bg-cloud-100 hover:border-cloud-400/30"}`}
        >
            {/* Caixa do check */}


            {icon && (
                <span className="flex shrink-0 items-center justify-center rounded-2xl bg-cloud-300/80 p-2">
                    <HugeiconsIcon icon={icon} size={26} className="shrink-0 text-cloud-500" />
                </span>
            )}

            <span className="min-w-0 flex-1">
                <span className="block font-semibold text-cloud-600">{title}</span>
                {description && (
                    <span className="block text-xs leading-snug text-neutral-500">{description}</span>
                )}
            </span>

            <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors
                    ${checked ? "border-cloud-500 bg-cloud-500 text-white" : "border-cloud-400/30 bg-white text-transparent"}`}
            >
                <HugeiconsIcon icon={Tick04Icon} size={18} strokeWidth={2.5} />
            </span>
        </button>
    );
};

export default InputCheckbox;
