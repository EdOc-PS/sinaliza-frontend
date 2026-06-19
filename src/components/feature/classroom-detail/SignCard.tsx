import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    DeleteIcon,
    Edit02Icon,
    FavouriteIcon,
    Medal06Icon,
    MoreVerticalIcon,
    PlayIcon,
    PlaySquareIcon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import Modal from "@components/ui/Modal";
import { DeleteRequest, PostRequest } from "@requests";
import { FAVORITES } from "@routes/favorites";
import { getYouTubeEmbedUrl, getYouTubeId, getYouTubeThumbnail } from "@lib/youtube/youtube";
import { GRAMMATICAL_META } from "@lib/constants/grammaticalClass";
import { formatDuration } from "@lib/format/duration";

export interface SignCardData {
    id: string;
    name: string;
    grammaticalClass: string;
    videoUrl: string | null;
    anotherUrl: string | null;
    createdAt: string;
}

// Item extra de dropdown específico de uma tela (ex: "Remover do histórico")
export interface SignCardAction {
    label: string;
    icon: IconSvgElement;
    onSelect: () => void;
    variant?: "default" | "danger";
}

interface SignCardProps {
    sign: SignCardData;
    canManage?: boolean;
    isFavorite?: boolean;
    onClick?: () => void;
    onFavorite?: (isFavorite: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onPromote?: () => void;
    actions?: SignCardAction[];
}

// Delay do hover (desktop) e do long-press (mobile) para iniciar a reprodução
const HOVER_PLAY_DELAY = 800;
const TOUCH_PLAY_DELAY = 600;

export const SignCard = ({
    sign,
    canManage = false,
    isFavorite = false,
    onClick,
    onFavorite,
    onEdit,
    onDelete,
    onPromote,
    actions,
}: SignCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimer = useRef<number | null>(null);
    const touchTimer = useRef<number | null>(null);

    const [duration, setDuration] = useState<string>("");
    const [playing, setPlaying] = useState(false);
    const [favorite, setFavorite] = useState(isFavorite);
    const [favLoading, setFavLoading] = useState(false);
    const [videoModal, setVideoModal] = useState(false);

    const grammatical = GRAMMATICAL_META[sign.grammaticalClass] ?? GRAMMATICAL_META.OTHER;
    const youtubeId = sign.anotherUrl ? getYouTubeId(sign.anotherUrl) : null;
    const youtubeThumbnail = !sign.videoUrl && sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null;
    const hasVideo = !!sign.videoUrl || !!youtubeId;

    const clearTimers = () => {
        if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
        if (touchTimer.current) { clearTimeout(touchTimer.current); touchTimer.current = null; }
    };

    const startPlay = () => {
        if (!hasVideo) return;
        setPlaying(true);
        videoRef.current?.play().catch(() => { });
    };

    const stopPlay = () => {
        clearTimers();
        setPlaying(false);
        const v = videoRef.current;
        if (v) { v.pause(); v.currentTime = 2; }
    };

    const handleMouseEnter = () => {
        if (!hasVideo) return;
        hoverTimer.current = window.setTimeout(startPlay, HOVER_PLAY_DELAY);
    };

    const handleTouchStart = () => {
        if (!hasVideo) return;
        touchTimer.current = window.setTimeout(startPlay, TOUCH_PLAY_DELAY);
    };

    const handleFavorite = async () => {
        if (favLoading) return;
        setFavLoading(true);
        try {
            const res = favorite
                ? await DeleteRequest(FAVORITES.REMOVE(sign.id))
                : await PostRequest(FAVORITES.ADD(sign.id), {});
            if (!res.success) { toast.error("Falha ao atualizar favorito: " + res.message); return; }
            const next = !favorite;
            setFavorite(next);
            toast.success(next ? "Adicionado aos favoritos" : "Removido dos favoritos");
            onFavorite?.(next);
        } finally {
            setFavLoading(false);
        }
    };

    useEffect(() => setFavorite(isFavorite), [isFavorite]);

    useEffect(() => clearTimers, []);

    return (
        <>
            <div
                className="group w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={stopPlay}
                onTouchStart={handleTouchStart}
                onTouchEnd={stopPlay}
                onTouchCancel={stopPlay}
            >
                {/* Thumbnail */}
                <div
                    className="relative aspect-video bg-cloud-500 rounded-2xl overflow-hidden cursor-pointer"
                    onClick={onClick}
                >
                    {/* Vídeo do R2 — frame inicial serve de thumbnail, toca no hover/long-press */}
                    {sign.videoUrl ? (
                        <video
                            ref={videoRef}
                            src={`${sign.videoUrl}#t=2`}
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            onLoadedMetadata={(e) => {
                                const v = e.currentTarget;
                                setDuration(formatDuration(v.duration));
                                if (!playing) v.currentTime = 2;
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : youtubeId && playing ? (
                        <>
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={getYouTubeEmbedUrl(youtubeId, { autoplay: true, mute: true, controls: false })}
                                title={sign.name}
                                allow="autoplay; encrypted-media"
                            />
                            {/* Overlay bloqueia interação direta com o iframe no preview, removendo o popup do Firefox */}
                            <div className="absolute inset-0" />
                        </>
                    ) : youtubeThumbnail ? (
                        <img
                            src={youtubeThumbnail}
                            alt={sign.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <HugeiconsIcon icon={SignLanguageCIcon} size={40} className="text-white/40" />
                        </div>
                    )}

                    {/* Botão de abrir vídeo no modal (canto superior direito) */}
                    {hasVideo && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setVideoModal(true); }}
                            className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all"
                            title="Ver vídeo"
                        >
                            <HugeiconsIcon icon={PlaySquareIcon} size={18} />
                        </button>
                    )}

                    {/* Play overlay */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110">
                                <HugeiconsIcon icon={PlayIcon} size={20} className="text-cloud-600 translate-x-0.5" />
                            </div>
                        </div>
                    )}

                    {/* Duração */}
                    {duration && !playing && (
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
                                    icon={<HugeiconsIcon icon={FavouriteIcon} size={18} className={favorite ? "fill-salmon-500 text-salmon-500" : ""} />}
                                    onSelect={handleFavorite}
                                >
                                    {favorite ? "Desfavoritar" : "Favoritar"}
                                </DropdownMenuItem>

                                {hasVideo && (
                                    <DropdownMenuItem
                                        icon={<HugeiconsIcon icon={PlaySquareIcon} size={18} />}
                                        onSelect={() => setVideoModal(true)}
                                    >
                                        Ver vídeo
                                    </DropdownMenuItem>
                                )}

                                {actions?.map((action) => (
                                    <DropdownMenuItem
                                        key={action.label}
                                        variant={action.variant}
                                        icon={<HugeiconsIcon icon={action.icon} size={18} />}
                                        onSelect={action.onSelect}
                                    >
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}

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

            {/* Modal rápido de vídeo */}
            <Modal open={videoModal} onClose={() => setVideoModal(false)} size="4xl">
                <div className="overflow-hidden rounded-2xl bg-black aspect-video">
                    {youtubeId ? (
                        <iframe
                            className="h-full w-full"
                            src={getYouTubeEmbedUrl(youtubeId, { autoplay: true })}
                            title={sign.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : sign.videoUrl ? (
                        <video controls autoPlay className="h-full w-full object-contain" src={sign.videoUrl} />
                    ) : null}
                </div>
            </Modal>
        </>
    );
};
