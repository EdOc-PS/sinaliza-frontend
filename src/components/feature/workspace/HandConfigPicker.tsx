import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight, Search01Icon, Tick02Icon, Tick04Icon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { HAND_CONFIG } from "@routes/handConfigs";
import Spinner from "@components/ui/Spinner";

export interface HandConfig {
    id: string;
    name: string;
    imgUrl?: string;
}

interface HandConfigPickerProps {
    value: string;
    onChange: (id: string) => void;
    gridClassName?: string;
    itemsPerPage?: number;
    /** Estilo compacto (igual ao VisualKeyboard): busca/setas menores e cards menores */
    compact?: boolean;
    /** Permite desmarcar clicando na configuração já selecionada */
    allowDeselect?: boolean;
    /**
     * Configurações já carregadas pelo pai. Quando informado, o componente não busca
     * na API — necessário no glossário público, cujo endpoint de mãos exige autenticação.
     */
    configs?: HandConfig[];
}

const DEFAULT_GRID = "grid grid-cols-8 gap-1.5";
const DEFAULT_ITEMS_PER_PAGE = 12;

const HandConfigPicker = ({
    value,
    onChange,
    gridClassName = DEFAULT_GRID,
    itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    compact = false,
    allowDeselect = false,
    configs: providedConfigs,
}: HandConfigPickerProps) => {
    const ITEMS_PER_PAGE = itemsPerPage;
    const isControlled = providedConfigs !== undefined;
    const [fetchedConfigs, setFetchedConfigs] = useState<HandConfig[]>([]);
    const [loading, setLoading]     = useState(false);
    const [search, setSearch]       = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce da busca (350ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchConfigs = useCallback(async (query?: string) => {
        setLoading(true);
        try {
            const response = await GetRequest<HandConfig[]>(
                HAND_CONFIG.FIND_ALL(),
                query ? { search: query } : undefined
            );
            if (!response.success) toast.error("Falha ao obter configurações de mão: " + response.message);
            setFetchedConfigs(response.object || []);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isControlled) return;
        fetchConfigs(debouncedSearch || undefined);
    }, [isControlled, fetchConfigs, debouncedSearch]);

    // Com configs vindas do pai, a busca é filtrada localmente
    const configs = isControlled
        ? providedConfigs!.filter((c) =>
            !debouncedSearch.trim() || c.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()))
        : fetchedConfigs;

    // Volta para a primeira página quando o filtro local muda o conjunto
    useEffect(() => {
        if (isControlled) setCurrentPage(1);
    }, [isControlled, debouncedSearch]);

    const totalPages = Math.max(1, Math.ceil(configs.length / ITEMS_PER_PAGE));
    const pageStart  = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated  = configs.slice(pageStart, pageStart + ITEMS_PER_PAGE);

    const selectedConfig = configs.find((c) => c.id === value);

    return (
        <div className="flex flex-col gap-3">

            {/* Busca + navegação */}
            {compact ? (
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                            <HugeiconsIcon icon={Search01Icon} size={16} />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl border-2 border-neutral-200 text-sm text-cloud-700 placeholder:text-neutral-400 hover:border-cloud-400 focus:border-cloud-400 focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <HugeiconsIcon icon={ChevronLeft} size={18} />
                    </button>
                    <span className="text-sm font-semibold text-cloud-500 min-w-10 text-center">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <HugeiconsIcon icon={ChevronRight} size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 mr-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cloud-400 pointer-events-none">
                            <HugeiconsIcon icon={Search01Icon} size={16} />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar configuração..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 text-sm text-cloud-700 placeholder:text-neutral-500 focus:border-cloud-500 focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 text-cloud-500 hover:border-cloud-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <HugeiconsIcon icon={ChevronLeft} size={16} />
                    </button>
                    <span className="text-xs font-semibold text-cloud-500 min-w-9 text-center">
                        {currentPage}/{totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 text-cloud-500 hover:border-cloud-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <HugeiconsIcon icon={ChevronRight} size={16} />
                    </button>
                </div>
            )}

            {/* Grid de imagens */}
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Spinner size={24} />
                </div>
            ) : configs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-400 gap-1">
                    <HugeiconsIcon icon={Search01Icon} size={24} />
                    <p className="text-xs">Nenhuma configuração encontrada</p>
                </div>
            ) : (
                <div className={gridClassName}>
                    {paginated.map((config) => {
                        const selected = value === config.id;
                        return (
                            <button
                                key={config.id}
                                type="button"
                                title={config.name}
                                onClick={() => onChange(allowDeselect && selected ? "" : config.id)}
                                className={`relative aspect-square ${compact ? "rounded-xl" : "rounded-2xl"} overflow-hidden border-2 transition-all flex items-center justify-center bg-white ${
                                    selected
                                        ? "border-campfire-500 ring-1 ring-campfire-300"
                                        : "border-transparent hover:border-campfire-300 hover:-translate-y-0.5"
                                }`}
                            >
                                {config.imgUrl ? (
                                    <img src={config.imgUrl} alt={config.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-neutral-400 font-medium">{config.name[0]}</span>
                                )}
                                {selected && (
                                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <HugeiconsIcon icon={Tick04Icon} size={18} className="text-campfire-500 drop-shadow" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Configuração selecionada */}
            {selectedConfig && (
                <p className="text-xs text-cloud-500 pl-1">
                    Selecionada: <strong className="text-campfire-600">{selectedConfig.name}</strong>
                </p>
            )}
        </div>
    );
};

export default HandConfigPicker;
