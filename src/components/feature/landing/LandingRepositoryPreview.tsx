import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { HandPointingRight02Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import { getCategoryBadgeClass } from "@lib/constants/category";
import { getYouTubeThumbnail } from "@lib/youtube/youtube";
import type { SignCardData } from "@components/feature/classroom-detail/SignCard";

interface LandingRepositoryPreviewProps {
    signs: SignCardData[];
    total: number;
}

// Prévia do repositório público — leva para /public-glossary
export const LandingRepositoryPreview = ({ signs, total }: LandingRepositoryPreviewProps) => {
    const navigate = useNavigate();

    // Sem sinais públicos ainda, a seção não agrega — não renderiza
    if (signs.length === 0) return null;

    return (
        <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Repositório público</span>
                        <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                            Explore sinais sem
                            <br />
                            precisar criar conta
                        </h2>
                        <p className="mt-4 text-base text-cloud-400">
                            {total} {total === 1 ? "sinal" : "sinais"} validados pelos gestores e abertos a
                            qualquer pessoa. Busque por palavra, categoria ou configuração de mão.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/public-glossary")}
                        className="flex shrink-0 items-center gap-2 rounded-3xl bg-lime-500 px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-lime-600"
                    >
                        Ver o repositório
                        <HugeiconsIcon icon={HandPointingRight02Icon} size={20} />
                    </button>
                </div>

                {/* Grid de prévia */}
                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {signs.slice(0, 4).map((sign, i) => {
                        const thumb = !sign.videoUrl && sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null;

                        return (
                            <button
                                key={sign.id}
                                onClick={() => navigate("/public-glossary")}
                                className="reveal group text-left transition-transform duration-300 hover:-translate-y-1.5"
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="relative aspect-video overflow-hidden rounded-2xl bg-cloud-500">
                                    {sign.videoUrl ? (
                                        <video
                                            src={`${sign.videoUrl}#t=2`}
                                            muted
                                            preload="metadata"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : thumb ? (
                                        <img src={thumb} alt={sign.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <HugeiconsIcon icon={SignLanguageCIcon} size={32} className="text-white/40" />
                                        </div>
                                    )}
                                </div>

                                <div className="px-1 pt-2.5">
                                    <h3 className="truncate font-baskerville font-bold text-cloud-600">{sign.name}</h3>
                                    {sign.category && (
                                        <span className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-[11px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                                            {sign.category.name}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LandingRepositoryPreview;
