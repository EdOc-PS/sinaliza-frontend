import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import { getCategoryBadgeClass } from "@lib/constants/category";
import { getYouTubeThumbnail } from "@lib/youtube/youtube";
import type { SignCardData } from "@components/feature/classroom-detail/SignCard";
import WordReveal from "./WordReveal";

interface LandingRepositoryPreviewProps {
    signs: SignCardData[];
    total: number;
}

// Prévia do repositório público — leva para /public-glossary.
// A seção é sempre renderizada; só o grid de sinais depende de haver dados.
export const LandingRepositoryPreview = ({ signs, total }: LandingRepositoryPreviewProps) => {
    const navigate = useNavigate();

    return (
        <section id="repositorio" className="bg-cloud-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <h2 className="reveal max-w-xl font-baskerville text-3xl font-normal leading-tight tracking-tight text-cloud-600 sm:text-5xl">
                        <WordReveal lines={[["Abra", "o", "repositório"], ["sem", "criar", "conta."]]} />
                    </h2>

                    <div className="reveal flex max-w-sm flex-col gap-5" style={{ transitionDelay: "120ms" }}>
                        <p className="text-[15px] leading-relaxed text-cloud-500/75">
                            {total > 0 && (
                                <strong className="font-baskerville text-2xl font-normal text-cloud-600">{total} sinais </strong>
                            )}
                            validados pelos gestores, com busca por palavra, categoria ou configuração de mão.
                        </p>
                        <Link
                            to="/public-glossary"
                            className="group flex items-center gap-1 text-sm font-semibold text-cloud-600 transition-colors duration-300 ease-out hover:text-campfire-600"
                        >
                            Ver todos os sinais
                            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Grid de prévia — só aparece quando já existem sinais públicos */}
                {signs.length > 0 && (
                    <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
                        {signs.slice(0, 4).map((sign, i) => {
                            const thumb = !sign.videoUrl && sign.anotherUrl ? getYouTubeThumbnail(sign.anotherUrl) : null;

                            return (
                                <div key={sign.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                                    <button onClick={() => navigate("/public-glossary")} className="group w-full text-left">
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cloud-500">
                                            {sign.videoUrl ? (
                                                <video
                                                    src={`${sign.videoUrl}#t=2`}
                                                    muted
                                                    preload="metadata"
                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : thumb ? (
                                                <img src={thumb} alt={sign.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <HugeiconsIcon icon={SignLanguageCIcon} size={32} className="text-white/40" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-2 px-1 pt-3">
                                            <h3 className="truncate font-baskerville text-lg text-cloud-600">{sign.name}</h3>
                                            {sign.category && (
                                                <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                                                    {sign.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LandingRepositoryPreview;
