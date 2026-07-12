import { useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";

import { TagsIcon } from "@hugeicons/core-free-icons";

import { PostRequest } from "@requests";
import { CATEGORIES } from "@routes/categories";

interface CategoryFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CategoryForm = ({ onClose, onSuccess }: CategoryFormProps) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const nameValid = name.trim().length >= 3;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameValid) return;

        setLoading(true);
        try {
            const res = await PostRequest(CATEGORIES.CREATE(), { name: name.trim() });
            if (!res.success) {
                toast.error("Falha ao criar categoria: " + res.message);
                return;
            }
            toast.success("Categoria criada com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Nova categoria</h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    Categorias agrupam os sinais por tipo (ex: Verbo, Animal, Saudação), deixando a busca e a
                    organização mais fáceis para alunos e educadores.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-name" isRequired>Nome</Label>
                <Input
                    id="category-name"
                    icon={TagsIcon}
                    placeholder="Ex: Animal"
                    value={name}
                    onChange={setName}
                    autoFocus
                />
                {name.trim() !== "" && !nameValid && (
                    <p className="text-xs text-neutral-400 pl-1">O nome precisa ter pelo menos 3 caracteres.</p>
                )}
            </div>

            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="w-3/5" disabled={!nameValid || loading} loading={loading} loadingText="Criando...">
                    Criar categoria
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
