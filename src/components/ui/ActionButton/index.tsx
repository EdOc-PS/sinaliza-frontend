import { HugeiconsIcon } from "@hugeicons/react";
import { HandPointingRight02Icon } from "@hugeicons/core-free-icons";

type ActionButtonVariant = "cloud" | "lime" | "sky" | "campfire" | "salmon";

const variantStyles: Record<ActionButtonVariant, string> = {
    cloud:    "bg-cloud-500 hover:bg-cloud-500/90",
    lime:     "bg-lime-500 hover:bg-lime-500/90",
    sky:      "bg-sky-500 hover:bg-sky-500/90",
    campfire: "bg-campfire-500 hover:bg-campfire-500/90",
    salmon:   "bg-salmon-500 hover:bg-salmon-500/90",
};

interface ActionButtonProps {
    variant?: ActionButtonVariant;
    image: string;
    title: string;
    description: string;
    onClick?: () => void;
    className?: string;
}

const ActionButton = ({
    variant = "cloud",
    image,
    title,
    description,
    onClick,
    className = "",
}: ActionButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${variantStyles[variant]} ${className}`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <img src={image} alt="" className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{title}</p>
                <p className="truncate text-sm text-white/70">{description}</p>
            </div>
            <HugeiconsIcon
                icon={HandPointingRight02Icon}
                size={20}
                className="shrink-0 text-white/50 transition-colors group-hover:text-white/80"
            />
        </button>
    );
};

export default ActionButton;
