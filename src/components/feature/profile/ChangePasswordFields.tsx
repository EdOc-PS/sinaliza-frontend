import { CirclePasswordIcon } from "@hugeicons/core-free-icons";

import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import { LIMITS } from "@lib/validation/limits";

export interface ChangePasswordValues {
    current: string;
    next: string;
    confirm: string;
}

export const EMPTY_PASSWORD_VALUES: ChangePasswordValues = { current: "", next: "", confirm: "" };

const MIN_LENGTH = 6;

export const isChangePasswordValid = ({ current, next, confirm }: ChangePasswordValues) =>
    current !== "" && next.length >= MIN_LENGTH && next === confirm && next !== current;

interface ChangePasswordFieldsProps {
    values: ChangePasswordValues;
    onChange: (values: ChangePasswordValues) => void;
    currentLabel: string;
}

// Campos usados no passo obrigatório do tour e no "Trocar senha" do perfil
export const ChangePasswordFields = ({ values, onChange, currentLabel }: ChangePasswordFieldsProps) => {
    const { current, next, confirm } = values;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="current-password" isRequired>{currentLabel}</Label>
                <Input
                    id="current-password"
                    type="password"
                    icon={CirclePasswordIcon}
                    placeholder="Digite a senha usada para entrar"
                    maxLength={LIMITS.PASSWORD}
                    value={current}
                    onChange={(value) => onChange({ ...values, current: value })}
                />
            </div>

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
                {next !== "" && next === current && (
                    <p className="pl-1 text-xs text-neutral-400">A nova senha precisa ser diferente da atual.</p>
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
