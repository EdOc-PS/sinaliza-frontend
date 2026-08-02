import { useState } from "react";
import { toast } from "sonner";
import { MailOpenLoveIcon } from "@hugeicons/core-free-icons";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";

import { PostRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";
import ModalStickyHeader from "@components/ui/Modal/StickyHeader";
import { isValidEmail } from "@lib/validation/email";

interface AddMemberFormProps {
    disciplineId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddMemberForm = ({ disciplineId, onClose, onSuccess }: AddMemberFormProps) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const emailValid = isValidEmail(email.trim());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailValid) return;

        setLoading(true);
        try {
            const res = await PostRequest(DISCIPLINES.ADD_MEMBER(disciplineId), { email: email.trim() });
            if (!res.success) {
                toast.error("Falha ao adicionar participante: " + res.message);
                return;
            }
            toast.success("Participante adicionado com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ModalStickyHeader>
                <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Adicionar participante</h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    Informe o email de um usuário já cadastrado para incluí-lo nesta disciplina. O papel (aluno,
                    familiar ou educador) é definido pelo perfil da conta.
                </p>
            </div>
            </ModalStickyHeader>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="member-email" isRequired>E-mail do usuário</Label>
                <Input
                    id="member-email"
                    icon={MailOpenLoveIcon}
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={setEmail}
                    autoFocus
                />
                {email.trim() !== "" && !emailValid && (
                    <p className="text-xs text-neutral-400 pl-1">Digite um e-mail válido.</p>
                )}
            </div>

            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="w-3/5" disabled={!emailValid || loading} loading={loading} loadingText="Adicionando...">
                    Adicionar
                </Button>
            </div>
        </form>
    );
};

export default AddMemberForm;
