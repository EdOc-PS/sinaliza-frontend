import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    BooksIcon,
    FilterIcon,
    GlobalEducationIcon,
    GlobeIcon,
    MortarboardIcon,
    Search01Icon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { GLOSSARY } from "@routes/signs";
import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";
import useScrollReveal from "@lib/hooks/useScrollReveal";

import Input from "@components/ui/Input";
import Spinner from "@components/ui/Spinner";
import HandConfigPicker, { type HandConfig } from "@components/feature/workspace/HandConfigPicker";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { GlossaryDisciplineCard } from "@components/feature/glossary/GlossaryDisciplineCard";
import { SignCard, type SignCardData } from "@components/feature/classroom-detail/SignCard";
import LandingHeader from "@components/feature/landing/LandingHeader";
import LandingFooter from "@components/feature/landing/LandingFooter";

// Confete de educação/globo
const GLOSSARY_ICONS = [GlobalEducationIcon, GlobalEducationIcon, GlobeIcon, BooksIcon, SignLanguageCIcon, MortarboardIcon];

interface GlossaryFilters {
    categories: CategorySlim[];
    handConfigs: HandConfig[];
    glossaryDisciplines: GlossaryDisciplineSlim[];
}

// Repositório público — mesma experiência do /glossary, mas sem exigir login.
// Favoritar/histórico não existem aqui; o clique no card abre o vídeo.
const PublicGlossaryPage = () => {
    const navigate = useNavigate();
    useScrollReveal();

    const [loading, setLoading] = useState(true);
    const [signs, setSigns] = useState<SignCardData[]>([]);
    const [categories, setCategories] = useState<CategorySlim[]>([]);
    const [handConfigs, setHandConfigs] = useState<HandConfig[]>([]);
    const [disciplines, setDisciplines] = useState<GlossaryDisciplineSlim[]>([]);
    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [handConfigId, setHandConfigId] = useState("");
    const [glossaryDisciplineId, setGlossaryDisciplineId] = useState("");

    const filtered = query.trim()
        ? signs.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        : signs;

    // Filtros vêm de um endpoint público único (/category e /hand-config exigem token)
    const loadFilters = async () => {
        const res = await GetRequest<GlossaryFilters>(GLOSSARY.FILTERS());
        if (!res.success || !res.object) return;
        setCategories(res.object.categories ?? []);
        setHandConfigs(res.object.handConfigs ?? []);
        setDisciplines(res.object.glossaryDisciplines ?? []);
    };

    const loadGlossary = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (categoryId) params.categoryId = categoryId;
            if (handConfigId) params.handConfigId = handConfigId;
            if (glossaryDisciplineId) params.glossaryDisciplineId = glossaryDisciplineId;

            const res = await GetRequest<SignCardData[]>(GLOSSARY.LIST(), Object.keys(params).length ? params : undefined);
            if (!res.success) { toast.error("Falha ao carregar o repositório: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFilters();
    }, []);

    useEffect(() => {
        loadGlossary();
    }, [categoryId, handConfigId, glossaryDisciplineId]);

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
                    <div className="flex flex-col gap-5 rounded-3xl bg-white p-5 sm:p-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-campfire-100">
                                <HugeiconsIcon icon={FilterIcon} size={20} className="text-campfire-600" />
                            </div>
                            <div>
                                <h2 className="font-baskerville text-lg font-bold text-cloud-600">Buscar sinais</h2>
                                <p className="text-sm text-neutral-500">
                                    Combine busca por palavra, categoria, configuração de mão e disciplina.
                                </p>
                            </div>
                        </div>

                        <Input
                            icon={Search01Icon}
                            wrapperClassName="bg-cloud-100"
                            value={query}
                            onChange={setQuery}
                            placeholder="Buscar no repositório..."
                        />

                        {/* Categorias como chips */}
                        {categories.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="px-1 text-sm font-semibold text-cloud-500">Categorias</span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryId("")}
                                        className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                                            categoryId === ""
                                                ? "bg-campfire-100 text-campfire-600"
                                                : "bg-cloud-100 text-cloud-500 hover:bg-cloud-200"
                                        }`}
                                    >
                                        Todas
                                    </button>
                                    {categories.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setCategoryId(categoryId === c.id ? "" : c.id)}
                                            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                                                categoryId === c.id
                                                    ? "bg-campfire-100 text-campfire-600"
                                                    : "bg-cloud-100 text-cloud-500 hover:bg-cloud-200"
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Teclado de configuração de mão */}
                        {handConfigs.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
                                    <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                                    Configuração de mão
                                </span>
                                <HandConfigPicker
                                    value={handConfigId}
                                    onChange={setHandConfigId}
                                    configs={handConfigs}
                                    compact
                                    allowDeselect
                                    gridClassName="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-1.5"
                                    itemsPerPage={24}
                                />
                            </div>
                        )}

                        {/* Disciplinas do glossário */}
                        {disciplines.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
                                    <HugeiconsIcon icon={MortarboardIcon} size={18} />
                                    Disciplinas
                                </span>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                    {disciplines.map((disc) => (
                                        <GlossaryDisciplineCard
                                            key={disc.id}
                                            discipline={disc}
                                            selected={glossaryDisciplineId === disc.id}
                                            onToggle={() =>
                                                setGlossaryDisciplineId(glossaryDisciplineId === disc.id ? "" : disc.id)
                                            }
                                            icons={GLOSSARY_ICONS}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
