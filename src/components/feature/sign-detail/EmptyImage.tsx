import { HugeiconsIcon } from "@hugeicons/react";
import { ImageNotFound02Icon } from "@hugeicons/core-free-icons";

interface EmptyImageProps {
    iconSize?: number;
    label?: string;
}

// Placeholder estilizado para imagem não cadastrada
export const EmptyImage = ({ iconSize = 32, label = "Sem imagem" }: EmptyImageProps) => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-cloud-200 text-cloud-500">
        <HugeiconsIcon icon={ImageNotFound02Icon} size={iconSize} />
        {label && <span className="text-xs font-medium">{label}</span>}
    </div>
);
