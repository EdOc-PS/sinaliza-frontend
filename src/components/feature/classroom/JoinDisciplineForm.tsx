import Button from "@components/ui/Button";
import { Key02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { InputCode } from "@components/ui/InputCode";

import { PostRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";

import { toast } from "sonner";

interface JoinDisciplineFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const JoinDisciplineForm = ({ onClose, onSuccess }: JoinDisciplineFormProps) => {
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const classCode = digits.join("");
        if (classCode.length !== 6) {
            toast.warning("Digite os 6 dígitos do código");
            return;
        }

        setLoading(true);
        try {
            const response = await PostRequest(DISCIPLINES.JOIN(), {
                classCode
            });

            if (!response.success) {
                toast.error(response.message || "Falha ao entrar na turma");
                return;
            }

            toast.success("Você entrou na turma com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const isValid = digits.every(d => d.length === 1);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 jcustify-center items-center">
            {/* Ícone */}
            <div className="flex items-center justify-between mb-2">
                <div className="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center">
                    <HugeiconsIcon icon={Key02Icon} size={32} className="text-sky-500" />
                </div>
            </div>

            {/* Título */}
            <div className="flex flex-col gap-1 text-center">
                <h2 className="text-2xl font-bold text-cloud-700 font-baskerville">
                    Participar de uma turma
                </h2>
                <p className="text-sm text-cloud-400">
                    Digite o código de 6 dígitos que seu professor compartilhou.
                </p>
            </div>

            {/* Campos de dígitos */}
            <InputCode digits={digits} onChange={setDigits} />

            {/* Ajuda */}
            <p className="text-xs text-center text-neutral-500">
                O código tem 6 letras ou números.
            </p>

            {/* Botões */}
            <div className="flex gap-3 w-4/5">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="cloud"
                    className="flex-1"
                    disabled={!isValid || loading}
                >
                    {loading ? "Entrando..." : "Entrar na turma"}
                </Button>
            </div>
        </form>
    );
};

