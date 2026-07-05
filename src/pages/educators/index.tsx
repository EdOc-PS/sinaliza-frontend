import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon, Search01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";

import { GetRequest, DeleteRequest } from "@requests";
import { USERS } from "@routes/users";

import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { EducatorForm } from "@components/feature/educators/EducatorForm";
import { ListCardEducator, type EducatorListItem } from "@components/feature/educators/ListCardEducator";

const EducatorsPage = () => {
    const [loading, setLoading] = useState(true);
    const [educators, setEducators] = useState<EducatorListItem[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [formModal, setFormModal] = useState<{ open: boolean; educatorId?: string }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
    const [deleting, setDeleting] = useState(false);

    // Debounce da busca (350ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const loadEducators = useCallback(async (query?: string) => {
        setLoading(true);
        try {
            const response = await GetRequest<EducatorListItem[]>(
                USERS.EDUCATORS(),
                query ? { search: query } : undefined,
            );
            if (!response.success) { toast.error("Falha ao carregar educadores: " + response.message); return; }
            setEducators(response.object ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEducators(debouncedSearch || undefined);
    }, [loadEducators, debouncedSearch]);

    const handleDeleteConfirm = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            const res = await DeleteRequest(USERS.DELETE(deleteModal.id));
            if (!res.success) { toast.error("Falha ao excluir educador: " + res.message); return; }
            toast.success("Educador excluído com sucesso!");
            setDeleteModal({ open: false });
            loadEducators(debouncedSearch || undefined);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <section className="flex flex-col gap-8">
                {/* Cabeçalho */}
                <div className="flex flex-col gap-4 rounded-3xl bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100">
                            <HugeiconsIcon icon={UserMultiple02Icon} size={26} className="text-lime-700" />
                        </div>
                        <div>
                            <h1 className="font-baskerville text-2xl font-bold text-cloud-600">Educadores</h1>
                            <p className="text-sm text-neutral-500">Cadastre e gerencie professores e intérpretes</p>
                        </div>
                    </div>

                    {/* Busca + novo educador */}
                    <div className="flex justify-between flex-col gap-10 sm:flex-row sm:items-center">
                        <div className="w-full">
                            <Input
                                icon={Search01Icon}
                                value={search}
                                onChange={setSearch}
                                placeholder="Buscar por nome ou email..."
                            />
                        </div>
                        <Button onClick={() => setFormModal({ open: true })} icon={AddCircleIcon} className="shrink-0">
                            Novo educador
                        </Button>
                    </div>
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size={32} color="#6B7280" />
                    </div>
                ) : educators.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                        <HugeiconsIcon icon={UserMultiple02Icon} size={40} className="text-cloud-300" />
                        <div>
                            <p className="text-sm font-medium text-cloud-500">
                                {debouncedSearch ? "Nenhum educador encontrado" : "Nenhum educador cadastrado"}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                                {debouncedSearch ? `Nada corresponde a "${debouncedSearch}".` : 'Clique em "Novo educador" para cadastrar o primeiro.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <span className="text-xs text-neutral-400">{educators.length} educador{educators.length > 1 ? "es" : ""}</span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {educators.map((edu) => (
                                <ListCardEducator
                                    key={edu.id}
                                    educator={edu}
                                    onEdit={() => setFormModal({ open: true, educatorId: edu.id })}
                                    onDelete={() => setDeleteModal({ open: true, id: edu.id, name: edu.name })}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Modal de cadastro/edição */}
            <Modal open={formModal.open} onClose={() => setFormModal({ open: false })} size="2xl">
                <EducatorForm
                    educatorId={formModal.educatorId}
                    onClose={() => setFormModal({ open: false })}
                    onSuccess={() => { setFormModal({ open: false }); loadEducators(debouncedSearch || undefined); }}
                />
            </Modal>

            {/* Confirmação de exclusão */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDeleteConfirm}
                loading={deleting}
                title={<>Excluir <span className="text-salmon-600 italic">Educador</span>?</>}
                description={
                    <>
                        O educador{" "}
                        <span className="font-semibold text-salmon-600 italic">{deleteModal.name}</span>{" "}
                        será removido permanentemente, junto com sua conta de acesso. Esta ação não pode ser desfeita.
                    </>
                }
                confirmText="Excluir educador"
            />
        </>
    );
};

export default EducatorsPage;
