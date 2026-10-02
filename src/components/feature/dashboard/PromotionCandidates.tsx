import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Medal06Icon, ViewIcon } from "@hugeicons/core-free-icons";

import { getCategoryBadgeClass } from "@lib/constants/category";
import { SignThumb } from "./SignUsageSection";
import type { PromotionCandidate } from "./types";

interface PromotionCandidatesProps {
    candidates: PromotionCandidate[];
    onPromote: (sign: PromotionCandidate) => void;
}

// Sinais ainda fora do glossário global que mais aparecem no uso real
// (acessos + favoritos) — onde o gestor deveria olhar primeiro.
export const PromotionCandidates = ({ candidates, onPromote }: PromotionCandidatesProps) => {
    const navigate = useNavigate();

    if (candidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-cloud-300 px-4 py-10 text-center">
                <HugeiconsIcon icon={Medal06Icon} size={28} className="text-cloud-300" />
                <p className="text-sm text-neutral-500">Nenhum candidato no momento.</p>
                <p className="max-w-xs text-xs text-neutral-400">
                    Sinais das turmas que forem acessados ou favoritados aparecem aqui.
                </p>
            </div>
        );
    }

    return (
        <ol className="flex flex-col gap-2">
            {candidates.map((sign, index) => (
                <li
                    key={sign.id}
                    className="flex cursor-pointer flex-col gap-3 rounded-2xl bg-cloud-100/60 p-3 transition-colors hover:bg-cloud-100 sm:flex-row sm:items-center"
                    onClick={() => navigate(`/signs/${sign.slug}`)}
                >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-cloud-400">{index + 1}</span>
                        <SignThumb sign={sign} />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="truncate text-sm font-semibold text-cloud-600">{sign.name}</span>
                                {sign.category && (
                                    <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                                        {sign.category.name}
                                    </span>
                                )}
                                {sign.globalStatus === "REJECTED" && (
                                    <span className="rounded-lg bg-salmon-100 px-1.5 py-0.5 text-[10px] font-semibold text-salmon-700">
                                        Recusado antes
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                                <span className="flex items-center gap-1 tabular-nums" title="Acessos">
                                    <HugeiconsIcon icon={ViewIcon} size={13} /> {sign.usageCount}
                                </span>
                                <span className="flex items-center gap-1 tabular-nums" title="Favoritos">
                                    <HugeiconsIcon icon={FavouriteIcon} size={13} /> {sign.favoriteCount}
                                </span>
                                {sign.creatorName && <span className="truncate">por {sign.creatorName}</span>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onPromote(sign); }}
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-campfire-100 px-3 py-2 text-xs font-semibold text-campfire-700 transition-colors hover:bg-campfire-200"
                    >
                        <HugeiconsIcon icon={Medal06Icon} size={14} />
                        Promover
                    </button>
                </li>
            ))}
        </ol>
    );
};

export default PromotionCandidates;
