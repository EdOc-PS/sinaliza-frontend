import { useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputText from "@components/ui/InputText";
import Label from "@components/ui/Label";

import { MortarboardIcon } from "@hugeicons/core-free-icons";

import { PostRequest, PatchRequest } from "@requests";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

interface GlossaryDisciplineFormProps {
    /** Quando informado, o formulário entra em modo de edição */
    discipline?: GlossaryDisciplineSlim;
    onClose: () => void;
    onSuccess: () => void;
}

export const GlossaryDisciplineForm = ({ discipline, onClose, onSuccess }: GlossaryDisciplineFormProps) => {
    const isEditMode = !!discipline;
    const [name, setName] = useState(discipline?.name ?? "");
    const [description, setDescription] = useState(discipline?.description ?? "");
    const [loading, setLoading] = useState(false);

    const nameValid = name.trim().length >= 2;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameValid) return;

        setLoading(true);
        try {
            const body = { name: name.trim(), description: description.trim() || undefined };
            const res = isEditMode
                ? await PatchRequest(GLOSSARY_DISCIPLINES.UPDATE(discipline!.id), body)
                : await PostRequest(GLOSSARY_DISCIPLINES.CREATE(), body);

            if (!res.success) {
                toast.error("Falha ao salvar disciplina: " + res.message);
                return;
            }
            toast.success(isEditMode ? "Disciplina atualizada com sucesso!" : "Disciplina criada com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                    {isEditMode ? "Editar disciplina" : "Nova disciplina do glossário"}
                </h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    As disciplinas do glossário organizam os sinais públicos por área (ex: Matemática, História).
                    Aparecem como cards no glossário global e são associadas ao sinal na hora de promovê-lo.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="glossary-discipline-name" isRequired>Nome</Label>
                <Input
                    id="glossary-discipline-name"
                    icon={MortarboardIcon}
                    placeholder="Ex: Matemática"
                    value={name}
                    onChange={setName}
                    autoFocus
                />
                {name.trim() !== "" && !nameValid && (
                    <p className="text-xs text-neutral-400 pl-1">O nome precisa ter pelo menos 2 caracteres.</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="glossary-discipline-description" isOptional>Descrição</Label>
                <InputText
                    id="glossary-discipline-description"
                    placeholder="Uma breve descrição do que essa disciplina agrupa."
                    value={description}
                    onChange={setDescription}
                    height="80px"
                />
            </div>

            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>Cancelar</Button>
                <Button
                    type="submit"
                    className="w-3/5"
                    disabled={!nameValid || loading}
                    loading={loading}
                    loadingText={isEditMode ? "Salvando..." : "Criando..."}
                >
                    {isEditMode ? "Salvar alterações" : "Criar disciplina"}
                </Button>
            </div>
        </form>
    );
};

export default GlossaryDisciplineForm;
