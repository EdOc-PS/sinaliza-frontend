import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    BooksIcon,
    GlobalEducationIcon,
    GlobeIcon,
    MortarboardIcon,
    Search01Icon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { GLOSSARY } from "@routes/signs";
import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";
import useScrollReveal from "@lib/hooks/useScrollReveal";

import Spinner from "@components/ui/Spinner";
import { type HandConfig } from "@components/feature/workspace/HandConfigPicker";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import GlossaryFilters from "@components/feature/glossary/GlossaryFilters";
import { SignCard, type SignCardData } from "@components/feature/classroom-detail/SignCard";
import LandingHeader from "@components/feature/landing/LandingHeader";
import LandingFooter from "@components/feature/landing/LandingFooter";

// Confete de educação/globo
const GLOSSARY_ICONS = [GlobalEducationIcon, GlobalEducationIcon, GlobeIcon, BooksIcon, SignLanguageCIcon, MortarboardIcon];

interface GlossaryFiltersResponse {
    categories: CategorySlim[];
    handConfigs: HandConfig[];
    glossaryDisciplines: GlossaryDisciplineSlim[];
}

// Repositório público — mesma experiência do /glossary, mas sem exigir login.
// Favoritar/histórico não existem aqui; o clique no card abre o vídeo.
const PublicGlossaryPage = () => {
    const navigate = useNavigate();
    useScrollReveal();

    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [handConfigId, setHandConfigId] = useState("");
    const [glossaryDisciplineId, setGlossaryDisciplineId] = useState("");

    // Filtros vêm de um endpoint público único (/category e /hand-config exigem token)
    const { data: filterData } = useQuery({
        queryKey: queryKeys.glossary.filters(),
        queryFn: () => unwrap(GetRequest<GlossaryFiltersResponse>(GLOSSARY.FILTERS())),
        staleTime: 30 * 60_000,
        meta: { errorMessage: "Falha ao carregar filtros" },
    });
    const categories = filterData?.categories ?? [];
    const handConfigs = filterData?.handConfigs ?? [];
    const disciplines = filterData?.glossaryDisciplines ?? [];

    const { data: signs = [], isPending: loading } = useQuery({
        queryKey: queryKeys.glossary.list({ categoryId, handConfigId, glossaryDisciplineId }),
        queryFn: () => {
            const params: Record<string, string> = {};
            if (categoryId) params.categoryId = categoryId;
            if (handConfigId) params.handConfigId = handConfigId;
            if (glossaryDisciplineId) params.glossaryDisciplineId = glossaryDisciplineId;
            return unwrap(GetRequest<SignCardData[]>(GLOSSARY.LIST(), Object.keys(params).length ? params : undefined));
        },
        meta: { errorMessage: "Falha ao carregar o repositório" },
    });

    // Busca textual é filtrada no cliente sobre o resultado já carregado
    const filtered = query.trim()
        ? signs.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        : signs;

    const hasFilters = !!categoryId || !!handConfigId || !!glossaryDisciplineId || !!query.trim();

    return (
        <div className="min-h-screen bg-cloud-100">
            <LandingHeader background="bg-cloud-100" />

            <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-8">
                    {/* Banner */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <CardMemphisBackground seed="glossary" color="#BACA57" rounded="rounded-3xl" icons={GLOSSARY_ICONS} />
                        <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8" style={{ minHeight: 200 }}>
                            {/* Voltar para a landing page */}
                            <button
                                onClick={() => navigate("/")}
                                className="flex w-fit cursor-pointer items-center gap-1.5 rounded-2xl bg-white/20 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-white/30"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                                Voltar ao início
                            </button>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                                <HugeiconsIcon icon={GlobalEducationIcon} size={28} className="text-white" />
                            </div>

                            <div>
                                <h1 className="font-baskerville text-2xl font-bold text-white sm:text-3xl">
                                    Repositório Público
                                </h1>
                                <p className="mt-1.5 max-w-lg text-sm text-white/85">
                                    Sinais validados e abertos a toda a comunidade — sem necessidade de login.
                                    Aprovados pelos gestores da instituição.
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-white/90">
                                <HugeiconsIcon icon={SignLanguageCIcon} size={18} className="text-white" />
                                <span><b className="text-white">{signs.length}</b> sinais públicos</span>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <GlossaryFilters
                        query={query}
                        onQueryChange={setQuery}
                        categories={categories}
                        categoryId={categoryId}
                        onCategoryChange={setCategoryId}
                        handConfigId={handConfigId}
                        onHandConfigChange={setHandConfigId}
                        handConfigs={handConfigs}
                        disciplines={disciplines}
                        glossaryDisciplineId={glossaryDisciplineId}
                        onDisciplineChange={setGlossaryDisciplineId}
                        disciplineIcons={GLOSSARY_ICONS}
                        searchWrapperClassName="bg-cloud-100"
                        placeholder="Buscar no repositório..."
                    />

                    {/* Conteúdo */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Spinner size={32} color="#6B7280" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                            <HugeiconsIcon icon={hasFilters ? Search01Icon : GlobalEducationIcon} size={40} className="text-cloud-300" />
                            <div>
                                <p className="text-sm font-medium text-cloud-500">
                                    {hasFilters ? "Nenhum sinal encontrado" : "Nenhum sinal público ainda"}
                                </p>
                                <p className="mt-1 text-xs text-neutral-400">
                                    {hasFilters
                                        ? "Ajuste a busca, a categoria ou a configuração de mão."
                                        : "Sinais promovidos e aprovados pelos gestores aparecerão aqui."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((sign) => (
                                <SignCard key={sign.id} sign={sign} publicMode />
                            ))}
                        </div>
                    )}

                </section>
            </main>

            <LandingFooter />
        </div>
    );
};

export default PublicGlossaryPage;
