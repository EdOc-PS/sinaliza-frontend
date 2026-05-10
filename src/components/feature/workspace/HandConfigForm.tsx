import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";

import { Clapping02Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { HAND_CONFIG } from "@routes/handConfigs";
import { PostRequest } from "@requests";

import { toast } from "sonner";

interface HandConfigFormData {
    name: string;
    imgUrl: string;
}

const EMPTY_FORM: HandConfigFormData = {
    name: "",
    imgUrl: "",
};

interface HandConfigFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const HandConfigForm = ({ onClose, onSuccess }: HandConfigFormProps) => {
    const [form, setForm] = useState<HandConfigFormData>(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof HandConfigFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name?.trim()) return;

        setLoading(true);
        try {
            const response = await PostRequest<HandConfigFormData>(HAND_CONFIG.CREATE(), form);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success("Configuração de mão criada com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const isValid = (form.name?.trim()?.length ?? 0) >= 1 && form.imgUrl?.trim().length > 0;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                    Criar configuração de mão
                </h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    Defina o nome e a imagem que representa esta configuração de mão.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-name">Nome</Label>
                <Input
                    id="hand-config-name"
                    icon={Clapping02Icon}
                    placeholder="Ex: Letra A"
                    value={form.name}
                    onChange={(v) => handleChange("name", v)}
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="hand-config-img">URL da imagem</Label>
                <Input
                    id="hand-config-img"
                    icon={Image01Icon}
                    placeholder="Ex: https://storage.example.com/letra-a.png"
                    value={form.imgUrl}
                    onChange={(v) => handleChange("imgUrl", v)}
                />
            </div>

            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="cloud" className="w-3/5" disabled={!isValid || loading}>
                    {loading ? "Criando..." : "Criar configuração"}
                </Button>
            </div>
        </form>
    );
};
