import { useRef, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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
import { CATEGORIES } from "@routes/categories";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import Spinner from "@components/ui/Spinner";
import { useAuth } from "@context/AuthContext";
import { useUnpromoteSign } from "@components/feature/workspace/useUnpromoteSign";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import {
    SignFiltersCard,
    EMPTY_SIGN_FILTERS,
    countActiveFilters,
    filtersToParams,
    type SignFilters,
} from "@components/feature/glossary/SignFiltersCard";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";

// Confete de educação/globo
const GLOSSARY_ICONS = [GlobalEducationIcon, GlobalEducationIcon, GlobeIcon, BooksIcon, SignLanguageCIcon, MortarboardIcon];

const GlossaryPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isManager = !!user?.roles?.includes("MANAGER");
    const unpromote = useUnpromoteSign();
    const [filters, setFilters] = useState<SignFilters>(EMPTY_SIGN_FILTERS);
    const resultsRef = useRef<HTMLDivElement>(null);
    const query = filters.query;

    // Opções dos filtros — mudam pouco, por isso o staleTime alto
    const [categoriesQuery, disciplinesQuery] = useQueries({
        queries: [
            {
                queryKey: queryKeys.categories.list(),
                queryFn: () => unwrap(GetRequest<CategorySlim[]>(CATEGORIES.LIST())),
                staleTime: 30 * 60_000,
                meta: { errorMessage: "Falha ao carregar categorias" },
            },
            {
                queryKey: queryKeys.glossaryDisciplines.list(),
                queryFn: () => unwrap(GetRequest<GlossaryDisciplineSlim[]>(GLOSSARY_DISCIPLINES.LIST())),
                staleTime: 30 * 60_000,
                meta: { errorMessage: "Falha ao carregar disciplinas" },
            },
        ],
    });
    const categories = categoriesQuery.data ?? [];
    const disciplines = disciplinesQuery.data ?? [];

    // Sinais — os filtros fazem parte da chave, então trocar um deles refaz a
    // busca sozinho (e volta instantâneo de um filtro já visitado).
    // A busca textual é aplicada no cliente — fica fora dos parâmetros da API
    const { search: _search, ...apiParams } = filtersToParams(filters);
    const { data: signs = [], isPending: loading } = useQuery({
        queryKey: queryKeys.glossary.list(apiParams),
        queryFn: () => unwrap(GetRequest<SignCardData[]>(GLOSSARY.LIST(), Object.keys(apiParams).length ? apiParams : undefined)),
        meta: { errorMessage: "Falha ao carregar o glossário" },
    });

    // Busca textual é filtrada no cliente sobre o resultado já carregado
    const filtered = query.trim()
        ? signs.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        : signs;


    const hasFilters = countActiveFilters(filters) > 0 || !!query.trim();

    return (
        <section className="flex flex-col gap-8">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl">
                <CardMemphisBackground seed="glossary" color="#BACA57" rounded="rounded-3xl" icons={GLOSSARY_ICONS} />
                <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8" style={{ minHeight: 200 }}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                        <HugeiconsIcon icon={GlobalEducationIcon} size={28} className="text-white" />
                    </div>

                    <div>
                        <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-white">
                            Glossário Global
                        </h1>
                        <p className="mt-1.5 max-w-lg text-sm text-white/85">
                            Sinais validados e disponíveis para toda a comunidade. Aprovados pelos gestores
                            da instituição.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-white/90">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={18} className="text-white" />
                        <span><b className="text-white">{signs.length}</b> sinais públicos</span>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <SignFiltersCard
                value={filters}
                onApply={setFilters}
                categories={categories}
                disciplines={disciplines}
                disciplineIcons={GLOSSARY_ICONS}
                placeholder="Buscar no glossário..."
                resultsRef={resultsRef}
            />

            {/* Conteúdo — âncora para o deslize automático ao pesquisar */}
            <div ref={resultsRef} className="-mb-8 scroll-mt-6" />
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
                        <p className="text-xs text-neutral-400 mt-1">
                            {hasFilters
                                ? "Ajuste a busca, a categoria ou a configuração de mão."
                                : "Sinais promovidos e aprovados pelos gestores aparecerão aqui."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((sign) => (
                        <SignCard
                            key={sign.id}
                            sign={{ ...sign, globalStatus: "PUBLIC" }}
                            hideStatusBadge
                            onClick={() => navigate(`/signs/${sign.slug}`)}
                            onUnpromote={isManager ? () => unpromote.ask(sign) : undefined}
                        />
                    ))}
                </div>
            )}
            {unpromote.modal}
        </section>
    );
};

export default GlossaryPage;
