import { useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputImage from "@components/ui/InputImage";
import Label from "@components/ui/Label";

import { Clapping02Icon } from "@hugeicons/core-free-icons";

import { HAND_CONFIG } from "@routes/handConfigs";
import { PostFormDataRequest, PatchFormDataRequest } from "@requests";

interface HandConfigFormData {
    id?: string;
    name: string;
    imgUrl?: string;
}

interface HandConfigFormProps {
    handConfig?: HandConfigFormData;
    onClose: () => void;
    onSuccess: () => void;
}

export const HandConfigForm = ({ handConfig, onClose, onSuccess }: HandConfigFormProps) => {
    const isEditMode = !!handConfig;

    const [name, setName]     = useState(handConfig?.name ?? "");
    const [file, setFile]     = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (!isEditMode && !file) return;

        const formData = new FormData();
        formData.append("name", name.trim());
        if (file) formData.append("image", file);

        setLoading(true);
        try {
            const response = isEditMode
                ? await PatchFormDataRequest(HAND_CONFIG.UPDATE(handConfig!.id!), formData)
                : await PostFormDataRequest(HAND_CONFIG.CREATE(), formData);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(isEditMode
                ? "Configuração de mão atualizada com sucesso!"
                : "Configuração de mão criada com sucesso!"
            );
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const nameValid = name.trim().length >= 3;
    const isValid   = nameValid && (isEditMode || !!file);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                    {isEditMode ? "Editar configuração de mão" : "Criar configuração de mão"}
                </h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    {isEditMode
                        ? "Atualize o nome ou a imagem desta configuração."
                        : "Defina o nome e a imagem que representa esta configuração de mão."}
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-name" isRequired>Nome</Label>
                <Input
                    id="hand-config-name"
                    icon={Clapping02Icon}
                    placeholder="Ex: Letra A"
                    value={name}
                    onChange={setName}
                />
                {name.trim() !== "" && !nameValid && (
                    <p className="text-xs text-neutral-400 pl-1">
                        O nome precisa ter pelo menos 3 caracteres.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-img" isRequired={!isEditMode} isOptional={isEditMode}>
                    Imagem da mão
                </Label>
                <InputImage
                    initialPreview={handConfig?.imgUrl}
                    description="Fundo neutro · 500x500px recomendado"
                    onChange={setFile}
                />
            </div>

            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="cloud"
                    className="w-3/5"
                    disabled={!isValid}
                    loading={loading}
                    loadingText={isEditMode ? "Salvando..." : "Criando..."}
                >
                    {isEditMode ? "Salvar alterações" : "Criar configuração"}
                </Button>
            </div>
        </form>
    );
};
