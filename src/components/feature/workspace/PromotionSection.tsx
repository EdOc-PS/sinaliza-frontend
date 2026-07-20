import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel02Icon, Medal06Icon, Tick04Icon } from "@hugeicons/core-free-icons";

import { GetRequest, PatchRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { getCategoryBadgeClass, type CategorySlim } from "@lib/constants/category";
import { getYouTubeThumbnail } from "@lib/youtube/youtube";

import Spinner from "@components/ui/Spinner";

interface PendingSign {
    id: string;
    name: string;
    videoUrl?: string | null;
    anotherUrl?: string | null;
    imgUrl?: string | null;
    createdAt: string;
    category?: CategorySlim | null;
    disciplines?: { id: string; name: string }[] | null;
}

interface PromotionSectionProps {
    /** Só o gestor pode aprovar/recusar; o educador vê a lista em modo leitura */
    canReview: boolean;
}

// Promoções de sinais ao glossário global — educador visualiza, só gestor aprova/recusa
export const PromotionSection = ({ canReview }: PromotionSectionProps) => {
    const navigate = useNavigate();
    const [signs, setSigns] = useState<PendingSign[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await GetRequest<PendingSign[]>(SIGNS.PROMOTIONS());
            if (!res.success) { toast.error("Falha ao carregar promoções: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const review = async (sign: PendingSign, approve: boolean) => {
        setProcessingId(sign.id);
        try {
            const res = await PatchRequest(SIGNS.REVIEW_PROMOTION(sign.id), { approve });
            if (!res.success) { toast.error(res.message); return; }
            toast.success(approve ? `"${sign.name}" agora é público!` : `Promoção de "${sign.name}" recusada`);
            setSigns((prev) => prev.filter((s) => s.id !== sign.id));
        } finally {
            setProcessingId(null);
        }
    };

    if (!loading && signs.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 rounded-3xl bg-sunflower-100 p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sunflower-200">
                    <HugeiconsIcon icon={Medal06Icon} size={24} className="text-sunflower-700" />
                </div>
                <div>
                    <h2 className="font-baskerville text-lg font-bold text-cloud-600">Promoções pendentes</h2>
                    <p className="text-sm text-cloud-500">
                        {signs.length} sina{signs.length > 1 ? "is" : "l"} aguardando aprovação para o glossário global
                        {!canReview && " · apenas gestores podem aprovar"}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Spinner size={28} color="#6B7280" />
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {signs.map((sign) => {
                        const busy = processingId === sign.id;
                        const thumb = sign.imgUrl
                            ?? (sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null);

                        return (
                            <div key={sign.id} className="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row sm:items-center">
                                <div
                                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                                    onClick={() => navigate(`/signs/${sign.id}`)}
                                >
                                    {/* Thumbnail */}
                                    <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cloud-500">
                                        {sign.videoUrl ? (
                                            <video src={`${sign.videoUrl}#t=2`} muted preload="metadata" className="h-full w-full object-cover" />
                                        ) : thumb ? (
                                            <img src={thumb} alt={sign.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <HugeiconsIcon icon={Medal06Icon} size={20} className="text-white/50" />
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="truncate font-medium text-cloud-600">{sign.name}</span>
                                            {sign.category && (
                                                <span className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                                                    {sign.category.name}
                                                </span>
                                            )}
                                        </div>
                                        {sign.disciplines && sign.disciplines.length > 0 && (
                                            <span className="truncate text-xs text-neutral-400">
                                                {sign.disciplines.map((d) => d.name).join(" · ")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {canReview && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => review(sign, false)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-salmon-100 px-3 py-2 text-sm font-medium text-salmon-600 transition-colors hover:bg-salmon-200 disabled:opacity-50 sm:flex-none"
                                        >
                                            <HugeiconsIcon icon={Cancel02Icon} size={22} />
                                            Recusar
                                        </button>
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => review(sign, true)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-lime-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-600 disabled:opacity-50 sm:flex-none"
                                        >
                                            <HugeiconsIcon icon={Tick04Icon} size={22} />
                                            Aprovar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PromotionSection;
