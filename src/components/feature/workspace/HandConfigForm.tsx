import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";

import { Clapping02Icon, Image01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useRef } from "react";

import { HAND_CONFIG } from "@routes/handConfigs";
import { PostFormDataRequest, PatchFormDataRequest } from "@requests";

import { toast } from "sonner";

interface HandConfigFormData {
    id?: string;
    name: string;
    imgUrl?: string;
}

interface HandConfigFormProps {
    /** Quando fornecido, o form entra em modo edição usando os dados passados */
    handConfig?: HandConfigFormData;
    onClose: () => void;
    onSuccess: () => void;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const HandConfigForm = ({ handConfig, onClose, onSuccess }: HandConfigFormProps) => {
    const isEditMode = !!handConfig;

    const [name, setName] = useState(handConfig?.name ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(handConfig?.imgUrl ?? null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selected: File) => {
        if (!ACCEPTED.includes(selected.type)) {
            toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
            return;
        }
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

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

    const isValid = name.trim().length >= 1 && (isEditMode || !!file);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Cabeçalho */}
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

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-name">Nome</Label>
                <Input
                    id="hand-config-name"
                    icon={Clapping02Icon}
                    placeholder="Ex: Letra A"
                    value={name}
                    onChange={setName}
                />
            </div>

            {/* Upload de imagem */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-img">
                    Imagem da mão {!isEditMode && <span className="text-salmon-400">*</span>}
                </Label>

                {preview ? (
                    /* Preview da imagem selecionada */
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-cloud-200 bg-neutral-50">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </button>
                        {file && (
                            <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                                {file.name}
                            </span>
                        )}
                    </div>
                ) : (
                    /* Área de drop */
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={`
                            w-full py-8 rounded-2xl border-2 border-dashed cursor-pointer
                            flex flex-col items-center justify-center gap-2 transition-all
                            ${dragging
                                ? "border-campfire-400 bg-campfire-50"
                                : "border-neutral-300 bg-neutral-50 hover:border-sunflower-400 hover:bg-sunflower-100"
                            }
                        `}
                    >
                        <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-campfire-100">
                            <HugeiconsIcon icon={Image01Icon} size={24} className="text-campfire-500" />
                        </span>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-cloud-700">Enviar imagem (PNG ou JPG)</p>
                            <p className="text-xs text-neutral-400">Fundo neutro · 500x500px recomendado</p>
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    id="hand-config-img"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                    }}
                />
            </div>

            {/* Ações */}
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
