import { useState } from "react";
import { toast } from "sonner";
import {
    LocationUser01Icon,
    MailOpenLoveIcon,
    PenTool03Icon,
    SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

import { useAuth } from "@context/AuthContext";
import { maskPhone } from "@/lib/mask/mask";
import { PERFIL_FORMULARIOS, getPerfilId } from "@/lib/constants/profileFields";

import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import InputText from "@components/ui/InputText";
import Select from "@components/ui/Select";
import Button from "@components/ui/Button";
import BackButton from "@components/ui/BackButton";
import ProgressBar from "@components/layout/ProgressBar";

interface EditAccountFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const EditAccountForm = ({ onClose, onSuccess }: EditAccountFormProps) => {
    const { user, updateUser } = useAuth();

    const [view, setView] = useState(0);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [phone, setPhone] = useState(user?.phone ? maskPhone(user.phone) : "");
    const [bio, setBio] = useState(user?.bio ?? "");

    const perfilId = user ? getPerfilId(user.roles, user.educatorType) : null;
    const formularioPerfil = perfilId ? PERFIL_FORMULARIOS[perfilId] : null;
    const [dataProfile, setDataProfile] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        if (formularioPerfil) {
            for (const campo of formularioPerfil.campos) {
                initial[campo.id] = (user?.dataProfile?.[campo.id as keyof typeof user.dataProfile] as string) ?? "";
            }
        }
        return initial;
    });

    const handleDataProfileChange = (field: string, value: string) => {
        setDataProfile((prev) => ({ ...prev, [field]: value }));
    };

    const totalSteps = formularioPerfil ? 3 : 2;
    // Sem formulário de perfil, a bio ocupa o step 1
    const bioView = formularioPerfil ? 2 : 1;

    const nameValid = name.trim().length >= 3;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isView0Valid = nameValid && emailValid;

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUser({
                name: name.trim(),
                email: email.trim(),
                phone: phone.replace(/\D/g, "") || undefined,
                bio: bio.trim() || undefined,
                dataProfile: formularioPerfil ? dataProfile : undefined,
            });
            toast.success("Conta atualizada com sucesso!");
            onSuccess();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao atualizar conta");
        } finally {
            setLoading(false);
        }
    };

    // Último step (bio) já tem o salvar como ação principal
    const lastStep = totalSteps - 1;
    const saveButton = view !== lastStep && (
        <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!isView0Valid || loading}
            loading={loading}
            loadingText="Salvando..."
            onClick={handleSave}
        >
            Salvar alterações
        </Button>
    );

    return (
        <div className="space-y-6">
            <ProgressBar currentStep={view} totalSteps={totalSteps} onStepClick={setView} />

            {/* Step 0: Dados pessoais */}
            {view === 0 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            Editar conta
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Atualize seus dados pessoais.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" isRequired>Seu nome:</Label>
                            <Input
                                id="name"
                                icon={LocationUser01Icon}
                                placeholder="Digite seu nome"
                                value={name}
                                noSpecialChars
                                onChange={setName}
                            />
                            {name.trim() !== "" && !nameValid && (
                                <p className="pl-1 text-xs text-neutral-400">
                                    O nome precisa ter pelo menos 3 caracteres.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" isRequired>E-mail:</Label>
                            <Input
                                id="email"
                                icon={MailOpenLoveIcon}
                                placeholder="usuario@example.com"
                                value={email}
                                onChange={setEmail}
                            />
                            {email.trim() !== "" && !emailValid && (
                                <p className="pl-1 text-xs text-neutral-400">Digite um e-mail válido.</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone" isOptional>Telefone:</Label>
                            <Input
                                id="phone"
                                icon={SmartPhone01Icon}
                                placeholder="(31) 99999-9999"
                                value={phone}
                                onChange={(value) => setPhone(maskPhone(value))}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancelar
                        </Button>
                        {saveButton}
                        <Button
                            type="button"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isView0Valid}
                            onClick={() => setView(formularioPerfil ? 1 : bioView)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 1: Dados do perfil */}
            {view === 1 && formularioPerfil && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            {formularioPerfil.titulo}
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            {formularioPerfil.descricao}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {formularioPerfil.campos.map((campo) => (
                            <div key={campo.id} className="flex flex-col gap-2">
                                <Label htmlFor={campo.id} isRequired={!campo.optional} isOptional={campo.optional}>{campo.label}</Label>
                                {campo.kind === "select" ? (
                                    <Select
                                        id={campo.id}
                                        icon={campo.icon}
                                        value={dataProfile[campo.id] || ""}
                                        onChange={(value) => handleDataProfileChange(campo.id, value)}
                                        options={campo.options || []}
                                    />
                                ) : (
                                    <Input
                                        id={campo.id}
                                        icon={campo.icon}
                                        type={campo.type}
                                        placeholder={campo.placeholder}
                                        value={dataProfile[campo.id] || ""}
                                        noSpecialChars={campo.noSpecialChars}
                                        onChange={(value) => handleDataProfileChange(campo.id, value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(0)} />
                        {saveButton}
                        <Button type="button" variant="cloud" className="flex-1" onClick={() => setView(2)}>
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Último step: Bio */}
            {view === bioView && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            Sua bio
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Conte um pouco sobre você.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bio" isOptional>Biografia:</Label>
                        <InputText
                            id="bio"
                            icon={PenTool03Icon}
                            placeholder="Escreva uma breve descrição sobre você, seus interesses e o que faz na plataforma."
                            value={bio}
                            onChange={setBio}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(formularioPerfil ? 1 : 0)} />
                        <Button
                            className="flex-1"
                            disabled={!isView0Valid || loading}
                            onClick={handleSave}
                            loading={loading}
                            loadingText="Salvando..."
                        >
                            Salvar alterações
                        </Button>
                    </div>
                </>
            )}


        </div>
    );
};
