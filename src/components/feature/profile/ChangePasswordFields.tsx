import { CirclePasswordIcon } from "@hugeicons/core-free-icons";

import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import { LIMITS } from "@lib/validation/limits";

export interface ChangePasswordValues {
    next: string;
    confirm: string;
}

export const EMPTY_PASSWORD_VALUES: ChangePasswordValues = { next: "", confirm: "" };

const MIN_LENGTH = 6;

export const isChangePasswordValid = ({ next, confirm }: ChangePasswordValues) =>
    next.length >= MIN_LENGTH && next === confirm;

interface ChangePasswordFieldsProps {
    values: ChangePasswordValues;
    onChange: (values: ChangePasswordValues) => void;
}

// Campos usados no passo obrigatório do tour e no "Trocar senha" do perfil
export const ChangePasswordFields = ({ values, onChange }: ChangePasswordFieldsProps) => {
    const { next, confirm } = values;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password" isRequired>Nova senha:</Label>
                <Input
                    id="new-password"
                    type="password"
                    icon={CirclePasswordIcon}
                    placeholder={`Mínimo ${MIN_LENGTH} caracteres`}
                    maxLength={LIMITS.PASSWORD}
                    value={next}
                    onChange={(value) => onChange({ ...values, next: value })}
                />
                {next !== "" && next.length < MIN_LENGTH && (
                    <p className="pl-1 text-xs text-neutral-400">A senha precisa ter pelo menos {MIN_LENGTH} caracteres.</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password" isRequired>Confirme a nova senha:</Label>
                <Input
                    id="confirm-password"
                    type="password"
                    icon={CirclePasswordIcon}
                    placeholder="Repita a nova senha"
                    maxLength={LIMITS.PASSWORD}
                    value={confirm}
                    onChange={(value) => onChange({ ...values, confirm: value })}
                />
                {confirm !== "" && next !== confirm && (
                    <p className="pl-1 text-xs text-neutral-400">As senhas não coincidem.</p>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordFields;
