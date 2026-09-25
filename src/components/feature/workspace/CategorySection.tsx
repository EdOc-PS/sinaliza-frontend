import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { DeleteIcon, MoreVerticalIcon, TagsIcon } from "@hugeicons/core-free-icons";

import { GetRequest, DeleteRequest } from "@requests";
import { CATEGORIES } from "@routes/categories";
import { type CategorySlim } from "@lib/constants/category";

import ActionButton from "@components/ui/ActionButton";
import Modal from "@components/ui/Modal";
import Pagination from "@components/ui/Pagination";

import createCategoryImg from "@/assets/images/app/create-category.webp";
import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { CategoryForm } from "./CategoryForm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { useReportLoading } from "@lib/hooks/useLoadingGroup";

const ITEMS_PER_PAGE = 9;

export const CategorySection = () => {
    const queryClient = useQueryClient();
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
    const [page, setPage] = useState(1);

    const { data: categories = [], isPending: loading } = useQuery({
        queryKey: queryKeys.categories.list(),
        queryFn: () => unwrap(GetRequest<CategorySlim[]>(CATEGORIES.LIST())),
        staleTime: 30 * 60_000,
        meta: { errorMessage: "Falha ao carregar categorias" },
    });

    // Participa do spinner unificado da tela (LoadingGroup)
    useReportLoading("categories", loading);

    const totalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));
    const pageStart = (page - 1) * ITEMS_PER_PAGE;
    const paginated = categories.slice(pageStart, pageStart + ITEMS_PER_PAGE);

    const { mutate: deleteItem, isPending: deleting } = useMutation({
        mutationFn: (itemId: string) => unwrap(DeleteRequest(CATEGORIES.DELETE(itemId))),
        onSuccess: () => {
            toast.success("Categoria excluída com sucesso!");
            setDeleteModal({ open: false });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const handleDelete = () => {
        if (!deleteModal.id) return;
        deleteItem(deleteModal.id);
    };

    return (
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-5">
            {/* Cabeçalho — botão sempre abaixo do texto, ocupando a largura inteira */}
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-campfire-100">
                        <HugeiconsIcon icon={TagsIcon} size={24} className="text-campfire-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-baskerville text-cloud-500">Categorias</h2>
                        <p className="text-sm text-neutral-500">
                            Organizam os sinais por tipo (ex: Verbo, Animal, Saudação) e ajudam na busca e nos sinais semelhantes.
                        </p>
                    </div>
                </div>

                <ActionButton
                    variant="campfire"
                    image={createCategoryImg}
                    title="Nova categoria"
                    description="Cadastre um novo tipo de sinal"
                    onClick={() => setCreateModal(true)}
                    className="w-full"
                />
            </div>

            {/* Listagem em pequenos cards */}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Spinner size={28} color="#6B7280" />
                </div>
            ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-10 text-center">
                    <HugeiconsIcon icon={TagsIcon} size={32} className="text-cloud-300" />
                    <p className="text-sm text-neutral-500">Nenhuma categoria cadastrada ainda.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 p-3">
                            <span className="flex-1 truncate pl-1 text-sm font-medium text-cloud-500">{cat.name}</span>

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-white hover:text-cloud-600">
                                        <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        variant="danger"
                                        icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                        onSelect={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })}
                                    >
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={setPage}
                        label={`${categories.length} categoria${categories.length > 1 ? "s" : ""}`}
                    />
                </div>
            )}

            {/* Modal de criação */}
            <Modal open={createModal} onClose={() => setCreateModal(false)} size="2xl">
                <CategoryForm
                    onClose={() => setCreateModal(false)}
                    onSuccess={() => { setCreateModal(false); queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }); }}
                />
            </Modal>

            {/* Confirmação de exclusão */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDelete}
                loading={deleting}
                title={<>Excluir <span className="text-salmon-600 italic">Categoria</span>?</>}
                description={
                    <>
                        A categoria{" "}
                        <span className="font-semibold text-salmon-600 italic">{deleteModal.name}</span>{" "}
                        será removida. Só é possível excluir categorias que não estão em uso por nenhum sinal.
                    </>
                }
                confirmText="Excluir categoria"
            />
        </div>
    );
};

export default CategorySection;
