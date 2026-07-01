import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight, Edit02Icon, DeleteIcon, Search01Icon } from "@hugeicons/core-free-icons";

import { GetRequest, DeleteRequest } from "@requests";
import { HAND_CONFIG } from "@/config/api/apiRoutes/handConfigs";
import { useFAB } from "@context/FABContext";
import ConfirmDeleteModal from "@/components/layout/ConfirmDeleteModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@components/ui/DropdownMenu";

export interface HandConfigTypeForm {
    id?: string;
    name: string;
    imgUrl?: string;
}

const ITEMS_PER_PAGE = 18;


interface TooltipProps {
    label: string;
    children: ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {isHovered && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none">
                    <div className="bg-cloud-700 text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
                        {label}
                    </div>
                    <svg className="mx-auto block" width="12" height="6" viewBox="0 0 12 6">
                        <path d="M0 0 L12 0 L6 6 Z" fill="#132433" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export interface VisualKeyboardProps {
    onEdit?: (config: HandConfigTypeForm) => void;
    refreshTrigger?: number;
    /** Modo seleção: clicar numa config chama onSelectConfig (sem editar/excluir nem card "+") */
    onSelectConfig?: (config: HandConfigTypeForm) => void;
    title?: string;
    subtitle?: string;
}

export const VisualKeyboard = ({ onEdit, refreshTrigger, onSelectConfig, title, subtitle }: VisualKeyboardProps) => {
    const { openForm } = useFAB();

    const [handConfigs, setHandConfigs] = useState<HandConfigTypeForm[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; configId?: string; configName?: string }>(
        { open: false }
    );
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Debounce search 350ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchAllHandConfigs = useCallback(async (searchQuery?: string) => {
        setLoading(true);
        try {
            const response = await GetRequest<HandConfigTypeForm[]>(
                HAND_CONFIG.FIND_ALL(),
                searchQuery ? { search: searchQuery } : undefined
            );
            if (!response.success) {
                toast.error("Falha ao obter configurações de mão: " + response.message);
            }
            setHandConfigs(response.object || []);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHandConfigs(debouncedSearch || undefined);
    }, [fetchAllHandConfigs, debouncedSearch, refreshTrigger]);

    const selectMode = !!onSelectConfig;
    // No modo seleção não há card "+", então a paginação considera só os itens reais
    const totalItems = selectMode ? handConfigs.length : handConfigs.length + 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE;
    const paginatedConfigs = handConfigs.slice(pageStart, Math.min(pageEnd, handConfigs.length));
    const showPlusCard = !selectMode && pageEnd > handConfigs.length;

    const handleDeleteClick = (configId: string, configName: string) => {
        setDeleteModal({ open: true, configId, configName });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.configId) return;

        setDeletingId(deleteModal.configId);
        try {
            const response = await DeleteRequest(HAND_CONFIG.DELETE(deleteModal.configId));
            if (!response.success) {
                toast.error("Falha ao deletar configuração: " + response.message);
                return;
            }
            toast.success("Configuração deletada com sucesso!");
            setDeleteModal({ open: false });
            fetchAllHandConfigs(debouncedSearch || undefined);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-6">

                {/* Cabeçalho */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                    {/* Título */}
                    <div>
                        <h2 className="text-lg font-baskerville text-cloud-500">{title ?? "Teclado visual de mãos"}</h2>
                        <p className="text-sm text-neutral-500">{subtitle ?? "Selecione a configuração para encontrar o sinal"}</p>
                    </div>

                    {/* Search + navegação */}
                    <div className="flex items-center gap-2">
                        {/* Input de busca */}
                        <div className="relative flex-1 lg:flex-none lg:w-52">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <HugeiconsIcon icon={Search01Icon} size={16} />
                            </span>
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl border-2 border-neutral-200 text-sm text-cloud-700 placeholder:text-neutral-400 hover:border-cloud-400 focus:border-cloud-400 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Setas de navegação */}
                        <button
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <HugeiconsIcon icon={ChevronLeft} size={18} />
                        </button>
                        <span className="text-sm font-semibold text-cloud-500 min-w-10 text-center">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <HugeiconsIcon icon={ChevronRight} size={18} />
                        </button>
                    </div>
                </div>

                {/* Grid de cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cloud-500" />
                    </div>
                ) : handConfigs.length === 0 && debouncedSearch ? (
                    <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-2">
                        <HugeiconsIcon icon={Search01Icon} size={32} />
                        <p className="text-sm">Nenhuma configuração encontrada para "<strong>{debouncedSearch}</strong>"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                        {paginatedConfigs.map((config) => (
                            <Tooltip key={config.name} label={config.name}>
                                {selectMode ? (
                                    <button
                                        onClick={() => onSelectConfig?.(config)}
                                        className="aspect-square rounded-xl hover:-translate-y-1 duration-300 hover:shadow-md hover:ring-2 hover:ring-campfire-300 transition-all flex items-center justify-center relative group w-full"
                                    >
                                        {config.imgUrl ? (
                                            <img
                                                src={config.imgUrl}
                                                alt={config.name}
                                                className="w-full h-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-neutral-400 font-medium">
                                                {config.name[0]}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                    </button>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="aspect-square rounded-xl hover:-translate-y-1 duration-300 hover:shadow-md hover:ring-2 hover:ring-campfire-300 transition-all flex items-center justify-center relative group">
                                                {config.imgUrl ? (
                                                    <img
                                                        src={config.imgUrl}
                                                        alt={config.name}
                                                        className="w-full h-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-neutral-400 font-medium">
                                                        {config.name[0]}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="center">
                                            <DropdownMenuItem
                                                icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                                                onSelect={() => onEdit?.(config)}
                                            >
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                variant="danger"
                                                icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                                onSelect={() => handleDeleteClick(config.id!, config.name)}
                                            >
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </Tooltip>
                        ))}

                        {/* Card "+" */}
                        {showPlusCard && (
                            <button
                                onClick={() => openForm("create-hand-config")}
                                className="aspect-square bg-lime-50 border-2 border-dashed border-lime-400 rounded-xl flex items-center justify-center hover:bg-lime-100 hover:border-lime-500 transition-all hover:-translate-y-1 duration-300"
                            >
                                <img src="src/assets/images/app/create-hand.png" alt="" className="w-8 h-8 sm:w-10 sm:h-10" />
                            </button>
                        )}
                    </div>
                )}

                {/* Dots de página */}
                <div className="flex justify-center items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`rounded-full transition-all duration-200 ${
                                currentPage === i + 1
                                    ? "w-5 h-2 bg-campfire-500"
                                    : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de confirmação de exclusão */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDeleteConfirm}
                loading={deletingId !== null}
                title={<>Excluir <span className="text-salmon-600 italic">Configuração de Mão</span>?</>}
                description={
                    <>
                        Tem certeza que deseja excluir{" "}
                        <strong>{deleteModal.configName}</strong>?{" "}
                        A imagem também será removida permanentemente.
                    </>
                }
                confirmText="Excluir configuração"
            />
        </>
    );
};
