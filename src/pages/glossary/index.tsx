import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { GLOSSARY } from "@routes/signs";
import { CATEGORIES } from "@routes/categories";
import type { CategorySlim } from "@lib/constants/category";

import Input from "@components/ui/Input";
import Spinner from "@components/ui/Spinner";
import HandConfigPicker from "@components/feature/workspace/HandConfigPicker";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";

// Confete de educação/globo
const GLOSSARY_ICONS = [GlobalEducationIcon, GlobalEducationIcon, GlobeIcon, BooksIcon, SignLanguageCIcon, MortarboardIcon];

const GlossaryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [signs, setSigns] = useState<SignCardData[]>([]);
    const [categories, setCategories] = useState<CategorySlim[]>([]);
    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [handConfigId, setHandConfigId] = useState("");

    const filtered = query.trim()
        ? signs.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        : signs;

    // Categorias para os chips de filtro (carregadas uma vez)
    const loadCategories = async () => {
        const res = await GetRequest<CategorySlim[]>(CATEGORIES.LIST());
        if (res.success && res.object) setCategories(res.object);
    };

    // Sinais públicos — filtro por categoria e configuração de mão no servidor
    const loadGlossary = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (categoryId) params.categoryId = categoryId;
            if (handConfigId) params.handConfigId = handConfigId;

            const res = await GetRequest<SignCardData[]>(GLOSSARY.LIST(), Object.keys(params).length ? params : undefined);
            if (!res.success) { toast.error("Falha ao carregar o glossário: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadGlossary();
    }, [categoryId, handConfigId]);

    const hasFilters = !!categoryId || !!handConfigId || !!query.trim();

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
            <div className="flex flex-col gap-5 rounded-3xl bg-white p-5 sm:p-6">
                {/* Busca textual */}
                <Input
                    icon={Search01Icon}
                    value={query}
                    onChange={setQuery}
                    placeholder="Buscar no glossário..."
                />

                {/* Categorias como chips (todas visíveis) */}
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
                <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                        Configuração de mão
                    </span>
                    <HandConfigPicker
                        value={handConfigId}
                        onChange={setHandConfigId}
                        compact
                        allowDeselect
                        gridClassName="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-1.5"
                        itemsPerPage={24}
                    />
                </div>
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
                        <p className="text-xs text-neutral-400 mt-1">
                            {hasFilters
                                ? "Ajuste a busca, a categoria ou a configuração de mão."
                                : "Sinais promovidos e aprovados pelos gestores aparecerão aqui."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((sign) => (
                        <SignCard
                            key={sign.id}
                            sign={sign}
                            onClick={() => navigate(`/signs/${sign.id}`)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default GlossaryPage;
