import { useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import { useAuth } from "@context/AuthContext";
import {
    ChangePasswordFields,
    EMPTY_PASSWORD_VALUES,
    isChangePasswordValid,
} from "./ChangePasswordFields";

interface ChangePasswordFormProps {
    onClose: () => void;
}

export const ChangePasswordForm = ({ onClose }: ChangePasswordFormProps) => {
    const { changePassword } = useAuth();
    const [values, setValues] = useState(EMPTY_PASSWORD_VALUES);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await changePassword(values.current, values.next);
            toast.success("Senha alterada com sucesso!");
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Não foi possível alterar a senha");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="pr-10 font-baskerville text-2xl font-semibold text-cloud-600">Trocar senha</h2>
            <ChangePasswordFields values={values} onChange={setValues} currentLabel="Senha atual:" />
            <Button type="submit" className="w-full" disabled={!isChangePasswordValid(values)} loading={saving}>
                Salvar nova senha
            </Button>
        </form>
    );
};

export default ChangePasswordForm;
