import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    CheckmarkCircle02Icon,
    DeleteIcon,
    Edit02Icon,
    MoreVerticalIcon,
    TaskDaily01Icon,
    Tick04Icon,
} from "@hugeicons/core-free-icons";

import { DeleteRequest, GetRequest, PostRequest } from "@requests";
import { ESSAYS } from "@routes/essays";

import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { EssayPromptForm, type EssayPrompt } from "./EssayPromptForm";

interface EssayPromptSectionProps {
    disciplineId: string;
    /** Educador/gestor da disciplina pode criar, editar e excluir propostas */
    canManage: boolean;
}

// Propostas de redação da disciplina Contexto — lista de tarefas com marcação individual
export const EssayPromptSection = ({ disciplineId, canManage }: EssayPromptSectionProps) => {
    const [prompts, setPrompts] = useState<EssayPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [formModal, setFormModal] = useState<{ open: boolean; prompt?: EssayPrompt }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await GetRequest<EssayPrompt[]>(ESSAYS.PROMPTS(disciplineId));
            if (!res.success) { toast.error("Falha ao carregar propostas: " + res.message); return; }
            setPrompts(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, [disciplineId]);

    useEffect(() => {
        load();
    }, [load]);

    // Marca/desmarca a proposta para o usuário logado (atualização otimista)
    const toggleCompleted = async (prompt: EssayPrompt) => {
        if (togglingId) return;
        setTogglingId(prompt.id);

        const next = !prompt.completed;
        setPrompts((prev) => prev.map((p) => (p.id === prompt.id ? { ...p, completed: next } : p)));

        try {
            const res = next
                ? await PostRequest(ESSAYS.COMPLETE(prompt.id), {})
                : await DeleteRequest(ESSAYS.COMPLETE(prompt.id));

            if (!res.success) {
                // Desfaz em caso de erro
                setPrompts((prev) => prev.map((p) => (p.id === prompt.id ? { ...p, completed: !next } : p)));
                toast.error(res.message);
            }
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            const res = await DeleteRequest(ESSAYS.DELETE_PROMPT(deleteModal.id));
            if (!res.success) { toast.error(res.message); return; }
            toast.success("Proposta excluída!");
            setDeleteModal({ open: false });
            load();
        } finally {
            setDeleting(false);
        }
    };

    const doneCount = prompts.filter((p) => p.completed).length;

    return (
        <div className="flex flex-col gap-5">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-baskerville text-xl text-cloud-500">Propostas de redação</h2>
                    {prompts.length > 0 && (
                        <p className="text-sm text-neutral-500">
                            {doneCount} de {prompts.length} concluída{doneCount === 1 ? "" : "s"}
                        </p>
                    )}
                </div>

                {canManage && (
                    <Button size="sm" icon={TaskDaily01Icon} onClick={() => setFormModal({ open: true })}>
                        Nova proposta
                    </Button>
                )}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex items-center justify-center py-14">
                    <Spinner size={28} color="#6B7280" />
                </div>
            ) : prompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                    <HugeiconsIcon icon={TaskDaily01Icon} size={36} className="text-cloud-300" />
                    <p className="text-sm text-neutral-500">Nenhuma proposta de redação ainda.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {prompts.map((prompt) => (
                        <div
                            key={prompt.id}
                            className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors duration-300 ${
                                prompt.completed
                                    ? "border-lime-300 bg-lime-100/60"
                                    : "border-cloud-400/10 bg-white"
                            }`}
                        >
                            {/* Marcar como feita */}
                            <button
                                type="button"
                                onClick={() => toggleCompleted(prompt)}
                                disabled={togglingId === prompt.id}
                                aria-pressed={prompt.completed}
                                aria-label={prompt.completed ? "Desmarcar proposta" : "Marcar como concluída"}
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-200 ${
                                    prompt.completed
                                        ? "border-lime-500 bg-lime-500 text-white"
                                        : "border-cloud-300 bg-white hover:border-lime-500"
                                }`}
                            >
                                {prompt.completed && <HugeiconsIcon icon={Tick04Icon} size={16} />}
                            </button>

                            <div className="min-w-0 flex-1">
                                <p className={`font-semibold text-cloud-600 ${prompt.completed ? "line-through opacity-70" : ""}`}>
                                    {prompt.title}
                                </p>
                                {prompt.description && (
                                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">{prompt.description}</p>
                                )}

                                {canManage && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                                        {prompt.completionCount} aluno(s) concluíram
                                    </div>
                                )}
                            </div>

                            {canManage && (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-cloud-100 hover:text-cloud-600"
                                        >
                                            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                                            onSelect={() => setFormModal({ open: true, prompt })}
                                        >
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="danger"
                                            icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                            onSelect={() => setDeleteModal({ open: true, id: prompt.id, title: prompt.title })}
                                        >
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de criar/editar */}
            <Modal open={formModal.open} onClose={() => setFormModal({ open: false })} size="2xl">
                <EssayPromptForm
                    disciplineId={disciplineId}
                    prompt={formModal.prompt}
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
                title={<>Excluir <span className="text-salmon-600 italic">Proposta</span>?</>}
                description={
                    <>
                        A proposta <span className="font-semibold italic text-salmon-600">{deleteModal.title}</span>{" "}
                        será removida, junto com as marcações de conclusão dos alunos.
                    </>
                }
                confirmText="Excluir proposta"
            />
        </div>
    );
};

export default EssayPromptSection;
