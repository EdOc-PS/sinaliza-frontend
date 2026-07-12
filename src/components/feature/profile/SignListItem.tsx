import { HugeiconsIcon } from "@hugeicons/react";
import { SignLanguageCIcon } from "@hugeicons/core-free-icons";

import { type CategorySlim } from "@lib/constants/category";
import { getYouTubeThumbnail } from "@lib/youtube/youtube";

export interface SignListData {
    id: string;
    name: string;
    category?: CategorySlim | null;
    videoUrl: string | null;
    anotherUrl: string | null;
}

interface SignListItemProps {
    sign: SignListData;
    onClick?: () => void;
    meta?: string;
}

// Linha compacta de sinal — usada nas listas de "últimos acessados" e "últimas curtidas"
export const SignListItem = ({ sign, onClick, meta }: SignListItemProps) => {
    const thumbnail = !sign.videoUrl && sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null;

    return (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-cloud-100"
        >
            {/* Thumbnail */}
            <div className="relative h-14 w-26 shrink-0 overflow-hidden rounded-xl bg-cloud-500">
                {sign.videoUrl ? (
                    <video src={`${sign.videoUrl}#t=2`} muted preload="metadata" className="h-full w-full object-cover" />
                ) : thumbnail ? (
                    <img src={thumbnail} alt={sign.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={20} className="text-white/50" />
                    </div>
                )}
            </div>

            {/* Nome + categoria */}
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-cloud-600">{sign.name}</p>
                {sign.category && <p className="truncate text-xs text-neutral-400">{sign.category.name}</p>}
            </div>

            {/* Meta (ex: horário) */}
            {meta && <span className="shrink-0 text-xs text-neutral-400">{meta}</span>}
        </button>
    );
};
