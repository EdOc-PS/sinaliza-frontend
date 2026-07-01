import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { HandPointingLeft02Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { SEARCH } from "@routes/search";

import Spinner from "@components/ui/Spinner";
import { SignCard, type SignCardData } from "@components/feature/classroom-detail/SignCard";

const SearchResultsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const search = params.get("search") ?? "";
    const handConfigId = params.get("handConfigId") ?? "";
    const grammaticalClass = params.get("grammaticalClass") ?? "";

    const [loading, setLoading] = useState(false);
    const [signs, setSigns] = useState<SignCardData[]>([]);

    const runSearch = useCallback(async () => {
        setLoading(true);
        try {
            const query: Record<string, string> = {};
            if (search) query.search = search;
            if (handConfigId) query.handConfigId = handConfigId;
            if (grammaticalClass) query.grammaticalClass = grammaticalClass;

            const res = await GetRequest<SignCardData[]>(SEARCH.SIGNS(), query);
            if (!res.success) { toast.error("Falha na busca: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, [search, handConfigId, grammaticalClass]);

    useEffect(() => {
        runSearch();
    }, [runSearch]);

    return (
        <section className="flex flex-col gap-6">
            {/* Topo: termo buscado + voltar */}
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-6">
                <div>
                    <h1 className="font-baskerville text-2xl font-bold text-cloud-600">
                        {search ? <>Resultados para "<span className="text-campfire-500 italic">{search}</span>"</> : "Resultados da busca"}
                    </h1>
                    <p className="text-sm text-neutral-500">Sinais das disciplinas em que você participa</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-3xl bg-cloud-300/80 p-2 w-16 h-16 transition-colors hover:bg-cloud-400/60"
                >
                    <HugeiconsIcon icon={HandPointingLeft02Icon} size={26} />
                </button>
            </div>

            {/* Resultados */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={32} color="#6B7280" />
                </div>
            ) : signs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                    <HugeiconsIcon icon={Search01Icon} size={40} className="text-cloud-300" />
                    <p className="text-sm font-medium text-cloud-500">Nenhum sinal encontrado</p>
                    <p className="text-xs text-neutral-400">Ajuste os filtros e tente novamente.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    <span className="text-xs text-neutral-400">{signs.length} sinais encontrados</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {signs.map((sign) => (
                            <SignCard
                                key={sign.id}
                                sign={sign}
                                onClick={() => navigate(`/signs/${sign.id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default SearchResultsPage;
