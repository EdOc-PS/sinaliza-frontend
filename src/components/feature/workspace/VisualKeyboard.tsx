import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight, Edit02Icon, DeleteIcon, Search01Icon, Clapping02Icon } from "@hugeicons/core-free-icons";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import Spinner from "@components/ui/Spinner";
import { Tooltip } from "@components/ui/Tooltip";
import { useReportLoading } from "@lib/hooks/useLoadingGroup";
import createHandImg from "@/assets/images/app/create-hand.png";

export interface HandConfigTypeForm {
    id?: string;
    name: string;
    imgUrl?: string;
}

const ITEMS_PER_PAGE = 18;

export interface VisualKeyboardProps {
    onEdit?: (config: HandConfigTypeForm) => void;
    refreshTrigger?: number;
    /** Modo seleção: clicar numa config chama onSelectConfig (sem editar/excluir nem card "+") */
    onSelectConfig?: (config: HandConfigTypeForm) => void;
    title?: string;
    subtitle?: string;
    /** Sem permissão de gestão: some o dropdown de editar/excluir e o card "+" — fica só visualização */
    canManage?: boolean;
}

export const VisualKeyboard = ({ onEdit, refreshTrigger, onSelectConfig, title, subtitle, canManage = true }: VisualKeyboardProps) => {
    const { openForm } = useFAB();

    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; configId?: string; configName?: string }>(
        { open: false }
    );
    const searchRef = useRef<HTMLInputElement>(null);
    const hasLoadedOnce = useRef(false);

    // Debounce search 350ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: handConfigs = [], isPending: loading, isFetched } = useQuery({
        queryKey: queryKeys.handConfigs.list(debouncedSearch),
        queryFn: () => unwrap(GetRequest<HandConfigTypeForm[]>(
            HAND_CONFIG.FIND_ALL(),
            debouncedSearch ? { search: debouncedSearch } : undefined,
        )),
        meta: { errorMessage: "Falha ao obter configurações de mão" },
    });

    // Marca que já houve uma carga (usado para o LoadingGroup abaixo).
    // Em efeito, não no render: mutar ref durante o render é inseguro.
    useEffect(() => {
        if (isFetched) hasLoadedOnce.current = true;
    }, [isFetched]);

    // Nova busca volta para a primeira página
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    // O pai ainda sinaliza atualização por prop (ex: após criar pelo FAB)
    useEffect(() => {
        if (refreshTrigger) queryClient.invalidateQueries({ queryKey: queryKeys.handConfigs.all });
    }, [refreshTrigger, queryClient]);

    // Participa do spinner unificado da tela (LoadingGroup). Só na carga inicial:
    // buscas seguintes usam o spinner interno, para não esconder o campo de busca.
    useReportLoading("hand-configs", loading && !debouncedSearch && !hasLoadedOnce.current);

    const selectMode = !!onSelectConfig;
    // No modo seleção ou sem permissão de gestão não há card "+", só os itens reais
    const totalItems = selectMode || !canManage ? handConfigs.length : handConfigs.length + 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE;
    const paginatedConfigs = handConfigs.slice(pageStart, Math.min(pageEnd, handConfigs.length));
    const showPlusCard = !selectMode && canManage && pageEnd > handConfigs.length;

    const handleDeleteClick = (configId: string, configName: string) => {
        setDeleteModal({ open: true, configId, configName });
    };

    const { mutate: deleteConfig, variables: deletingVars, isPending: deletingConfig } = useMutation({
        mutationFn: (configId: string) => unwrap(DeleteRequest(HAND_CONFIG.DELETE(configId))),
        onSuccess: () => {
            toast.success("Configuração deletada com sucesso!");
            setDeleteModal({ open: false });
            queryClient.invalidateQueries({ queryKey: queryKeys.handConfigs.all });
        },
        onError: (err: Error) => toast.error("Falha ao deletar configuração: " + err.message),
    });
    const deletingId = deletingConfig ? deletingVars ?? null : null;

    const handleDeleteConfirm = () => {
        if (!deleteModal.configId) return;
        deleteConfig(deleteModal.configId);
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
                        <Spinner size={32} color="#6B7280" />
                    </div>
                ) : handConfigs.length === 0 && debouncedSearch ? (
                    <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-2">
                        <HugeiconsIcon icon={Search01Icon} size={32} />
                        <p className="text-sm">Nenhuma configuração encontrada para "<strong>{debouncedSearch}</strong>"</p>
                    </div>
                ) : handConfigs.length === 0 && !canManage ? (
                    // Sem permissão de gestão e nenhuma config. cadastrada: sem o "+" de criar,
                    // só resta orientar a pessoa a pedir para o gestor
                    <div className="flex flex-col items-center justify-center py-12 text-neutral-400 gap-2">
                        <HugeiconsIcon icon={Clapping02Icon} size={32} />
                        <p className="text-sm text-cloud-500">Nenhuma configuração de mão cadastrada ainda.</p>
                        <p className="text-xs text-neutral-400 text-center max-w-xs">
                            Precisa de uma nova? Entre em contato com o gestor da instituição.
                        </p>
                    </div>
                ) : (
                    <div className="stagger-children grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                        {paginatedConfigs.map((config) => (
                            <Tooltip key={config.name} label={config.name} position="top">
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
                                ) : canManage ? (
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <button type="button" className="w-full aspect-square rounded-xl hover:-translate-y-1 duration-300 hover:shadow-md hover:ring-2 hover:ring-campfire-300 transition-all flex items-center justify-center relative group">
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
                                ) : (
                                    // Sem permissão de gestão: mesma aparência, sem dropdown de ações
                                    <div className="w-full aspect-square rounded-xl flex items-center justify-center relative">
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
                                    </div>
                                )}
                            </Tooltip>
                        ))}

                        {/* Card "+" */}
                        {showPlusCard && (
                            <Tooltip label="Nova configuração de mão" position="top">
                                <button
                                    onClick={() => openForm("create-hand-config")}
                                    className="w-full aspect-square bg-lime-50 border-2 border-dashed border-lime-400 rounded-xl flex items-center justify-center hover:bg-lime-100 hover:border-lime-500 transition-all hover:-translate-y-1 duration-300"
                                >
                                    <img src={createHandImg} alt="" className="w-8 h-8 sm:w-10 sm:h-10" />
                                </button>
                            </Tooltip>
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
