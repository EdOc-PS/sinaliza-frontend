import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DeleteIcon,
    DocumentAttachmentIcon,
    Download01Icon,
    MoreVerticalIcon,
    Note01Icon,
} from "@hugeicons/core-free-icons";

import { DeleteRequest, GetRequest, PostFormDataRequest } from "@requests";
import { ESSAYS } from "@routes/essays";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputFile from "@components/ui/InputFile";
import InputText from "@components/ui/InputText";
import Label from "@components/ui/Label";
import Modal from "@components/ui/Modal";
import ModalStickyHeader from "@components/ui/Modal/StickyHeader";
import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";

interface EssayExample {
    id: string;
    title: string;
    description?: string | null;
    fileUrl: string;
    createdAt: string;
}

interface EssayExampleSectionProps {
    disciplineId: string;
    canManage: boolean;
}

// Exemplos de redação da disciplina Contexto — arquivos (PDF/imagem) no R2
export const EssayExampleSection = ({ disciplineId, canManage }: EssayExampleSectionProps) => {
    const [examples, setExamples] = useState<EssayExample[]>([]);
    const [loading, setLoading] = useState(true);
    const [formModal, setFormModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
    const [deleting, setDeleting] = useState(false);

    // Formulário
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const titleValid = title.trim().length >= 3;
    const formValid = titleValid && !!file;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await GetRequest<EssayExample[]>(ESSAYS.EXAMPLES(disciplineId));
            if (!res.success) { toast.error("Falha ao carregar exemplos: " + res.message); return; }
            setExamples(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, [disciplineId]);

    useEffect(() => {
        load();
    }, [load]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid) return;

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            if (description.trim()) formData.append("description", description.trim());
            formData.append("file", file!);

            const res = await PostFormDataRequest(ESSAYS.CREATE_EXAMPLE(disciplineId), formData);
            if (!res.success) { toast.error("Falha ao enviar exemplo: " + res.message); return; }

            toast.success("Exemplo adicionado!");
            setFormModal(false);
            resetForm();
            load();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setDeleting(true);
        try {
            const res = await DeleteRequest(ESSAYS.DELETE_EXAMPLE(deleteModal.id));
            if (!res.success) { toast.error(res.message); return; }
            toast.success("Exemplo excluído!");
            setDeleteModal({ open: false });
            load();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-baskerville text-xl text-cloud-500">Exemplos de redação</h2>
                    <p className="text-sm text-neutral-500">
                        Modelos para consulta — abra o arquivo para ler.
                    </p>
                </div>

                {canManage && (
                    <Button size="sm" icon={Note01Icon} onClick={() => setFormModal(true)}>
                        Novo exemplo
                    </Button>
                )}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex items-center justify-center py-14">
                    <Spinner size={28} color="#6B7280" />
                </div>
            ) : examples.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                    <HugeiconsIcon icon={Note01Icon} size={36} className="text-cloud-300" />
                    <p className="text-sm text-neutral-500">Nenhum exemplo de redação ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {examples.map((example) => (
                        <div
                            key={example.id}
                            className="flex flex-col gap-3 rounded-2xl border-2 border-cloud-400/10 bg-white p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                                    <HugeiconsIcon icon={DocumentAttachmentIcon} size={22} className="text-sky-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-cloud-600">{example.title}</p>
                                    {example.description && (
                                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                                            {example.description}
                                        </p>
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
                                                variant="danger"
                                                icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                                onSelect={() => setDeleteModal({ open: true, id: example.id, title: example.title })}
                                            >
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            <a
                                href={example.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-2xl bg-cloud-100 py-2.5 text-sm font-semibold text-cloud-500 transition-colors duration-300 hover:bg-cloud-200"
                            >
                                <HugeiconsIcon icon={Download01Icon} size={18} />
                                Abrir redação
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de novo exemplo */}
            <Modal open={formModal} onClose={() => { setFormModal(false); resetForm(); }} size="2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <ModalStickyHeader>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-baskerville text-2xl font-medium text-cloud-700">
                                Novo exemplo de redação
                            </h2>
                            <p className="text-sm leading-snug text-cloud-400">
                                Envie um PDF ou uma imagem da redação para servir de modelo aos alunos.
                            </p>
                        </div>
                    </ModalStickyHeader>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="example-title" isRequired>Título</Label>
                        <Input
                            id="example-title"
                            icon={Note01Icon}
                            placeholder="Ex: Redação nota 1000 — ENEM 2024"
                            value={title}
                            onChange={setTitle}
                            autoFocus
                        />
                        {title.trim() !== "" && !titleValid && (
                            <p className="pl-1 text-xs text-neutral-400">O título precisa ter pelo menos 3 caracteres.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="example-description" isOptional>Comentário</Label>
                        <InputText
                            id="example-description"
                            placeholder="O que destacar nesta redação? (estrutura, argumentação, repertório...)"
                            value={description}
                            onChange={setDescription}
                            height="90px"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label isRequired>Arquivo</Label>
                        <InputFile
                            description="PDF, PNG, JPG ou WEBP · até 10MB"
                            onChange={setFile}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-2/5"
                            onClick={() => { setFormModal(false); resetForm(); }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="w-3/5"
                            disabled={!formValid || saving}
                            loading={saving}
                            loadingText="Enviando..."
                        >
                            Adicionar exemplo
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Confirmação de exclusão */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDelete}
                loading={deleting}
                title={<>Excluir <span className="italic text-salmon-600">Exemplo</span>?</>}
                description={
                    <>
                        O exemplo <span className="font-semibold italic text-salmon-600">{deleteModal.title}</span>{" "}
                        e o arquivo enviado serão removidos permanentemente.
                    </>
                }
                confirmText="Excluir exemplo"
            />
        </div>
    );
};

export default EssayExampleSection;
