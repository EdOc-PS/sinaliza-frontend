import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { DeleteIcon, Edit02Icon, MoreVerticalIcon, MortarboardIcon } from "@hugeicons/core-free-icons";

import { GetRequest, DeleteRequest } from "@requests";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import ActionButton from "@components/ui/ActionButton";
import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { GlossaryDisciplineForm } from "./GlossaryDisciplineForm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";

import createClassImg from "@/assets/images/app/create-class.png";

export const GlossaryDisciplineSection = () => {
    const [disciplines, setDisciplines] = useState<GlossaryDisciplineSlim[]>([]);
    const [loading, setLoading] = useState(true);
    const [formModal, setFormModal] = useState<{ open: boolean; discipline?: GlossaryDisciplineSlim }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await GetRequest<GlossaryDisciplineSlim[]>(GLOSSARY_DISCIPLINES.LIST());
            if (!res.success) { toast.error("Falha ao carregar disciplinas: " + res.message); return; }
            setDisciplines(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            const res = await DeleteRequest(GLOSSARY_DISCIPLINES.DELETE(deleteModal.id));
            if (!res.success) { toast.error(res.message); return; }
            toast.success("Disciplina excluída com sucesso!");
            setDeleteModal({ open: false });
            load();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-5">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                        <HugeiconsIcon icon={MortarboardIcon} size={24} className="text-sky-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-baskerville text-cloud-500">Disciplinas do glossário</h2>
                        <p className="text-sm text-neutral-500">
                            Agrupam os sinais públicos por área (ex: Matemática, História). Aparecem como cards no
                            glossário global e são associadas ao sinal ao promovê-lo.
                        </p>
                    </div>
                </div>

                <ActionButton
                    variant="sky"
                    image={createClassImg}
                    title="Nova disciplina"
                    description="Cadastre uma disciplina do glossário"
                    onClick={() => setFormModal({ open: true })}
                    className="flex-1"
                />
            </div>

            {/* Listagem em pequenos cards */}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Spinner size={28} color="#6B7280" />
                </div>
            ) : disciplines.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-10 text-center">
                    <HugeiconsIcon icon={MortarboardIcon} size={32} className="text-cloud-300" />
                    <p className="text-sm text-neutral-500">Nenhuma disciplina cadastrada ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {disciplines.map((disc) => (
                        <div key={disc.id} className="flex items-start gap-3 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 p-3">
                            <div className="min-w-0 flex-1 pl-1">
                                <p className="truncate text-sm font-medium text-cloud-500">{disc.name}</p>
                                {disc.description && (
                                    <p className="truncate text-xs text-neutral-400">{disc.description}</p>
                                )}
                                <p className="mt-0.5 text-xs text-neutral-400">
                                    {disc._count?.signs ?? 0} sinal(is)
                                </p>
                            </div>

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-white hover:text-cloud-600">
                                        <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                                        onSelect={() => setFormModal({ open: true, discipline: disc })}
                                    >
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="danger"
                                        icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                        onSelect={() => setDeleteModal({ open: true, id: disc.id, name: disc.name })}
                                    >
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de criação/edição */}
            <Modal open={formModal.open} onClose={() => setFormModal({ open: false })} size="2xl">
                <GlossaryDisciplineForm
                    discipline={formModal.discipline}
                    onClose={() => setFormModal({ open: false })}
                    onSuccess={() => { setFormModal({ open: false }); load(); }}
                />
            </Modal>

            {/* Confirmação de exclusão */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDelete}
                loading={deleting}
                title={<>Excluir <span className="text-salmon-600 italic">Disciplina</span>?</>}
                description={
                    <>
                        A disciplina{" "}
                        <span className="font-semibold text-salmon-600 italic">{deleteModal.name}</span>{" "}
                        será removida. Só é possível excluir disciplinas que não estão associadas a nenhum sinal.
                    </>
                }
                confirmText="Excluir disciplina"
            />
        </div>
    );
};

export default GlossaryDisciplineSection;
