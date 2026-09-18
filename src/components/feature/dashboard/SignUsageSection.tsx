import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon, Medal06Icon } from "@hugeicons/core-free-icons";

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

interface SignUsageRowProps {
    sign: SignUsage;
    maxCount: number;
    barClassName: string;
    onPromote?: (sign: SignUsage) => void;
}

const SignUsageRow = ({ sign, maxCount, barClassName, onPromote }: SignUsageRowProps) => {
    const navigate = useNavigate();
    const thumb = sign.imgUrl ?? (sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null);
    const width = maxCount > 0 ? Math.max(6, (sign.usageCount / maxCount) * 100) : 6;
    const canPromote = onPromote && (!sign.globalStatus || sign.globalStatus === "PRIVATE" || sign.globalStatus === "REJECTED");

    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
            <div
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                onClick={() => navigate(`/signs/${sign.slug}`)}
            >
                <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cloud-500">
                    {sign.videoUrl ? (
                        <video src={`${sign.videoUrl}#t=2`} muted preload="metadata" className="h-full w-full object-cover" />
                    ) : thumb ? (
                        <img src={thumb} alt={sign.name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-xs font-medium text-white/60">{sign.name[0]}</span>
                    )}
                </div>

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
                        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${width}%` }} />
                    </div>
                </div>
            </div>

            <span className="shrink-0 text-xs font-semibold text-cloud-500">
                {sign.usageCount} acesso{sign.usageCount === 1 ? "" : "s"}
            </span>

            {canPromote && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onPromote!(sign); }}
                    className="flex shrink-0 items-center gap-1 rounded-xl bg-campfire-100 px-2.5 py-1.5 text-xs font-medium text-campfire-700 transition-colors hover:bg-campfire-200"
                >
                    <HugeiconsIcon icon={Medal06Icon} size={14} />
                    Promover
                </button>
            )}
        </div>
    );
};

interface SignUsageListProps {
    title: string;
    icon: typeof ArrowUp01Icon;
    iconClassName: string;
    barClassName: string;
    signs: SignUsage[];
    onPromote?: (sign: SignUsage) => void;
}

const SignUsageList = ({ title, icon, iconClassName, barClassName, signs, onPromote }: SignUsageListProps) => {
    const maxCount = Math.max(1, ...signs.map((s) => s.usageCount));

    return (
        <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconClassName}`}>
                    <HugeiconsIcon icon={icon} size={16} />
                </span>
                <h3 className="font-baskerville text-sm font-bold text-cloud-600">{title}</h3>
            </div>

            {signs.length === 0 ? (
                <p className="py-6 text-center text-xs text-neutral-400">Nenhum sinal cadastrado ainda</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {signs.map((sign) => (
                        <SignUsageRow key={sign.id} sign={sign} maxCount={maxCount} barClassName={barClassName} onPromote={onPromote} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface SignUsageSectionProps {
    mostUsed: SignUsage[];
    leastUsed: SignUsage[];
    loading?: boolean;
    onPromote?: (sign: SignUsage) => void;
}

// Mostra os sinais mais e menos usados lado a lado. `onPromote` habilita o
// botão de promoção nos cards ainda não públicos — só faz sentido no
// dashboard do gestor, por isso é opcional (a turma não recebe essa prop).
export const SignUsageSection = ({ mostUsed, leastUsed, loading = false, onPromote }: SignUsageSectionProps) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size={28} color="#6B7280" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <SignUsageList
                title="Mais usados"
                icon={ArrowUp01Icon}
                iconClassName="bg-lime-200 text-lime-700"
                barClassName="bg-lime-500"
                signs={mostUsed}
                onPromote={onPromote}
            />
            <SignUsageList
                title="Menos usados"
                icon={ArrowDown01Icon}
                iconClassName="bg-salmon-200 text-salmon-700"
                barClassName="bg-salmon-400"
                signs={leastUsed}
                onPromote={onPromote}
            />
        </div>
    );
};

export default SignUsageSection;
