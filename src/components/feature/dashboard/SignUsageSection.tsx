import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";

import { getCategoryBadgeClass, type CategorySlim } from "@lib/constants/category";
import { getYouTubeThumbnail } from "@lib/youtube/youtube";
import Spinner from "@components/ui/Spinner";

export interface SignUsage {
    id: string;
    name: string;
    slug: string;
    videoUrl?: string | null;
    anotherUrl?: string | null;
    imgUrl?: string | null;
    category?: CategorySlim | null;
    globalStatus?: "PRIVATE" | "PENDING" | "PUBLIC" | "REJECTED";
    usageCount: number;
}

export const SignThumb = ({ sign }: { sign: Pick<SignUsage, "name" | "videoUrl" | "anotherUrl" | "imgUrl"> }) => {
    const thumb = sign.imgUrl ?? (sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null);
    return (
        <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cloud-500">
            {sign.videoUrl ? (
                <video src={`${sign.videoUrl}#t=2`} muted preload="metadata" className="h-full w-full object-cover" />
            ) : thumb ? (
                <img src={thumb} alt={sign.name} className="h-full w-full object-cover" />
            ) : (
                <span className="text-xs font-medium text-white/60">{sign.name[0]}</span>
            )}
        </div>
    );
};

const SignUsageRow = ({ sign, maxCount }: { sign: SignUsage; maxCount: number }) => {
    const navigate = useNavigate();
    const width = maxCount > 0 ? Math.max(6, (sign.usageCount / maxCount) * 100) : 6;

    return (
        <div
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3 transition-colors hover:bg-cloud-100/60"
            onClick={() => navigate(`/signs/${sign.slug}`)}
        >
            <SignThumb sign={sign} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-cloud-600">{sign.name}</span>
                    {sign.category && (
                        <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                            {sign.category.name}
                        </span>
                    )}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cloud-100">
                    <div className="h-full rounded-full bg-lime-500" style={{ width: `${width}%` }} />
                </div>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-cloud-500">
                {sign.usageCount} acesso{sign.usageCount === 1 ? "" : "s"}
            </span>
        </div>
    );
};

interface SignUsageSectionProps {
    signs: SignUsage[];
    loading?: boolean;
    title?: string;
}

// Lista dos sinais mais acessados, com barra proporcional ao mais usado.
// Usada no dashboard do gestor e na aba "Uso" da turma.
export const SignUsageSection = ({ signs, loading = false, title = "Mais usados" }: SignUsageSectionProps) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size={28} color="#6B7280" />
            </div>
        );
    }

    const maxCount = Math.max(1, ...signs.map((s) => s.usageCount));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-200 text-lime-700">
                    <HugeiconsIcon icon={ArrowUp01Icon} size={16} />
                </span>
                <h3 className="font-baskerville text-sm font-bold text-cloud-600">{title}</h3>
            </div>

            {signs.length === 0 ? (
                <p className="rounded-2xl bg-white py-8 text-center text-xs text-neutral-400">Nenhum sinal cadastrado ainda</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {signs.map((sign) => (
                        <SignUsageRow key={sign.id} sign={sign} maxCount={maxCount} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SignUsageSection;
