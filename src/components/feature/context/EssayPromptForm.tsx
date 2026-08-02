import { useState } from "react";
import { toast } from "sonner";
import { TaskDaily01Icon } from "@hugeicons/core-free-icons";

import { PostRequest, PatchRequest } from "@requests";
import { ESSAYS } from "@routes/essays";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputText from "@components/ui/InputText";
import Label from "@components/ui/Label";
import ModalStickyHeader from "@components/ui/Modal/StickyHeader";

export interface EssayPrompt {
    id: string;
    title: string;
    description?: string | null;
    completed: boolean;
    completedAt?: string | null;
    completionCount: number;
}

interface EssayPromptFormProps {
    disciplineId: string;
    /** Quando informado, o formulário entra em modo de edição */
    prompt?: EssayPrompt;
    onClose: () => void;
    onSuccess: () => void;
}

export const EssayPromptForm = ({ disciplineId, prompt, onClose, onSuccess }: EssayPromptFormProps) => {
    const isEditMode = !!prompt;
    const [title, setTitle] = useState(prompt?.title ?? "");
    const [description, setDescription] = useState(prompt?.description ?? "");
    const [loading, setLoading] = useState(false);

    const titleValid = title.trim().length >= 3;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleValid) return;

        setLoading(true);
        try {
            const body = {
                title: title.trim(),
                description: description.trim() || undefined,
            };
            const res = isEditMode
                ? await PatchRequest(ESSAYS.UPDATE_PROMPT(prompt!.id), body)
                : await PostRequest(ESSAYS.CREATE_PROMPT(disciplineId), body);

            if (!res.success) { toast.error("Falha ao salvar proposta: " + res.message); return; }
            toast.success(isEditMode ? "Proposta atualizada!" : "Proposta criada!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ModalStickyHeader>
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                        {isEditMode ? "Editar proposta" : "Nova proposta de redação"}
                    </h2>
                    <p className="text-sm text-cloud-400 leading-snug">
                        As propostas aparecem como uma lista de tarefas — cada aluno marca as que já fez.
                    </p>
                </div>
            </ModalStickyHeader>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="prompt-title" isRequired>Título</Label>
                <Input
                    id="prompt-title"
                    icon={TaskDaily01Icon}
                    placeholder="Ex: Os desafios da inclusão de surdos na escola"
                    value={title}
                    onChange={setTitle}
                    autoFocus
                />
                {title.trim() !== "" && !titleValid && (
                    <p className="pl-1 text-xs text-neutral-400">O título precisa ter pelo menos 3 caracteres.</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="prompt-description" isOptional>Enunciado</Label>
                <InputText
                    id="prompt-description"
                    placeholder="Descreva a proposta, o tema e o que se espera da redação."
                    value={description}
                    onChange={setDescription}
                    height="120px"
                />
            </div>

            <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>Cancelar</Button>
                <Button
                    type="submit"
                    className="w-3/5"
                    disabled={!titleValid || loading}
                    loading={loading}
                    loadingText={isEditMode ? "Salvando..." : "Criando..."}
                >
                    {isEditMode ? "Salvar alterações" : "Criar proposta"}
                </Button>
            </div>
        </form>
    );
};

export default EssayPromptForm;
