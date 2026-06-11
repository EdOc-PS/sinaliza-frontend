import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DeleteIcon,
    Edit02Icon,
    FavouriteIcon,
    Medal06Icon,
    MoreVerticalIcon,
    PlayIcon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";

export interface SignCardData {
    id: string;
    name: string;
    grammaticalClass: string;
    videoUrl: string | null;
    anotherUrl: string | null;
    createdAt: string;
}

interface SignCardProps {
    sign: SignCardData;
    canManage?: boolean;
    onClick?: () => void;
    onFavorite?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onPromote?: () => void;
}

export const GRAMMATICAL_META: Record<string, { label: string; className: string }> = {
    VERB:      { label: "Verbo",       className: "bg-lime-100 text-lime-700" },
    ADJECTIVE: { label: "Adjetivo",    className: "bg-sky-100 text-sky-700" },
    NOUN:      { label: "Substantivo", className: "bg-campfire-100 text-campfire-700" },
    OTHER:     { label: "Outros",      className: "bg-neutral-200 text-neutral-600" },
};

function formatDuration(seconds: number): string {
    if (!isFinite(seconds) || seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export const SignCard = ({
    sign,
    canManage = false,
    onClick,
    onFavorite,
    onEdit,
    onDelete,
    onPromote,
}: SignCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState<string>("");

    const grammatical = GRAMMATICAL_META[sign.grammaticalClass] ?? GRAMMATICAL_META.OTHER;

    const handleMouseEnter = () => videoRef.current?.play().catch(() => {});
    const handleMouseLeave = () => {
        const v = videoRef.current;
        if (v) { v.pause(); v.currentTime = 0; }
    };

    return (
        <div
            className="group w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Thumbnail */}
            <div
                className="relative aspect-video bg-cloud-500 rounded-2xl overflow-hidden cursor-pointer"
                onClick={onClick}
            >
                {sign.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={`${sign.videoUrl}#t=0.1`}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={40} className="text-white/40" />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110">
                        <HugeiconsIcon icon={PlayIcon} size={20} className="text-cloud-600 translate-x-0.5" />
                    </div>
                </div>

                {/* Duração */}
                {duration && (
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                        {duration}
                    </span>
                )}
            </div>

            {/* Info abaixo */}
            <div className="flex items-start justify-between gap-2 pt-2.5 px-1">
                <div
                    className="flex flex-col gap-1 cursor-pointer flex-1 min-w-0"
                    onClick={onClick}
                >
                    <h3 className="font-baskerville text-base font-bold text-cloud-600 leading-snug truncate">
                        {sign.name}
                    </h3>
                    <span className={`w-fit rounded-lg px-2 py-0.5 text-[11px] font-semibold ${grammatical.className}`}>
                        {grammatical.label}
                    </span>
                </div>

                {/* Menu de 3 pontos */}
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="mt-0.5 p-1.5 rounded-xl hover:bg-cloud-100 transition-colors focus:outline-none text-neutral-400 hover:text-cloud-600">
                                <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent >
                            <DropdownMenuItem
                                icon={<HugeiconsIcon icon={FavouriteIcon} size={18} />}
                                onSelect={() => onFavorite?.()}
                            >
                                Favoritar
                            </DropdownMenuItem>

                            {canManage && (
                                <>
                                    <DropdownMenuItem
                                        icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                                        onSelect={() => onEdit?.()}
                                    >
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        icon={<HugeiconsIcon icon={Medal06Icon} size={18} />}
                                        onSelect={() => onPromote?.()}
                                    >
                                        Promover
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="danger"
                                        icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                        onSelect={() => onDelete?.()}
                                    >
                                        Excluir
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};
