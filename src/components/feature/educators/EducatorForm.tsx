import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputCheckbox from "@components/ui/InputCheckbox";
import InputText from "@components/ui/InputText";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import Spinner from "@components/ui/Spinner";
import ProgressBar from "@components/layout/ProgressBar";
import BackButton from "@components/ui/BackButton";

import {
    CirclePasswordIcon,
    LocationUser01Icon,
    MailOpenLoveIcon,
    PenTool03Icon,
    SmartPhone01Icon,
    StarAward01Icon,
} from "@hugeicons/core-free-icons";

import { GetRequest, PatchRequest, PostRequest } from "@requests";
import { USERS } from "@routes/users";
import { maskPhone } from "@lib/mask/mask";
import { PERFIL_FORMULARIOS } from "@lib/constants/profileFields";
import type { CreateEducatorPayload, EducatorType, Role, User } from "@api/requests";

// Só os dois tipos de educador
type EducatorKind = "educator" | "interpreter";

const KIND_TO_EDUCATOR_TYPE: Record<EducatorKind, EducatorType> = {
    educator: "TEACHER",
    interpreter: "INTERPRETER",
};

interface EducatorFormProps {
    educatorId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const EducatorForm = ({ educatorId, onClose, onSuccess }: EducatorFormProps) => {
    const isEditMode = !!educatorId;

    // Edição: tipo (0), dados (1) e perfil (2). Criação inclui ainda bio (3) e senha (4).
    const [view, setView] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEditMode);

    const [kind, setKind] = useState<EducatorKind | null>(null);
    const [isManager, setIsManager] = useState(false);
    const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dadosPerfil, setDadosPerfil] = useState<Record<string, string>>({});

    const loadEducator = async (id: string) => {
        setLoadingData(true);
        try {
            const res = await GetRequest<User>(USERS.FIND_ONE(id));
            if (!res.success || !res.object) {
                toast.error("Falha ao carregar educador: " + res.message);
                return;
            }
            const u = res.object;
            setKind(u.educatorType === "INTERPRETER" ? "interpreter" : "educator");
            setIsManager((u.roles ?? []).includes("MANAGER"));
            setCurrentRoles(u.roles ?? []);
            setName(u.name ?? "");
            setEmail(u.email ?? "");
            setPhone(u.phone ?? "");
            setBio(u.bio ?? "");
            const p = u.dataProfile ?? {};
            setDadosPerfil({
                department: p.department ?? "",
                specialty: p.specialty ?? "",
                certificate: p.certificate ?? "",
                areaAtuacao: p.areaAtuacao ?? "",
                proficienciaLibras: p.proficienciaLibras ?? "",
            });
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (educatorId) loadEducator(educatorId);
    }, [educatorId]);

    const formulario = kind ? PERFIL_FORMULARIOS[kind] : null;

    const handleProfileChange = (fieldId: string, value: string) => {
        setDadosPerfil((prev) => ({ ...prev, [fieldId]: value }));
    };

    // Validações por step
    const nameValid = name.trim().length >= 3;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isStep1Valid = nameValid && emailValid;

    const isStep2Valid = () =>
        !!formulario && formulario.campos.every((campo) => campo.optional || (dadosPerfil[campo.id]?.trim() ?? "") !== "");

    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword;
    const isStep3Valid = passwordValid && passwordsMatch && confirmPassword.trim() !== "";

    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (view === 0 && kind) { setView(1); return; }
        if (view === 1 && isStep1Valid) { setView(2); return; }
        if (view === 2 && isStep2Valid()) {
            if (isEditMode) { handleSubmit(); } else { setView(3); }
            return;
        }
        if (view === 3) { setView(4); return; }
        if (view === 4 && isStep3Valid) { handleSubmit(); }
    };

    const handleSubmit = async () => {
        if (!kind) return;
        setLoading(true);
        try {
            if (isEditMode && educatorId) {
                const res = await PatchRequest(USERS.UPDATE(educatorId), {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone || undefined,
                    bio: bio || undefined,
                    dataProfile: {
                        ...dadosPerfil,
                        educatorType: KIND_TO_EDUCATOR_TYPE[kind],
                    },
                });
                if (!res.success) { toast.error("Falha ao atualizar educador: " + res.message); return; }

                // Sincroniza o perfil de gestor (MANAGER) se o checkbox mudou
                const hasManager = currentRoles.includes("MANAGER");
                if (hasManager !== isManager) {
                    const roles: Role[] = isManager
                        ? [...currentRoles, "MANAGER"]
                        : currentRoles.filter((r) => r !== "MANAGER");
                    const rolesRes = await PatchRequest(USERS.UPDATE_ROLES(educatorId), { roles });
                    if (!rolesRes.success) { toast.error("Falha ao atualizar perfil de gestor: " + rolesRes.message); return; }
                }

                toast.success("Educador atualizado com sucesso!");
                onSuccess();
                return;
            }

            const payload: CreateEducatorPayload = {
                name: name.trim(),
                email: email.trim(),
                password,
                educatorType: KIND_TO_EDUCATOR_TYPE[kind],
                isManager: isManager || undefined,
                phone: phone || undefined,
                bio: bio || undefined,
                dataProfile: {
                    ...dadosPerfil,
                    educatorType: KIND_TO_EDUCATOR_TYPE[kind],
                },
            };

            const res = await PostRequest(USERS.CREATE_EDUCATOR(), payload);
            if (!res.success) { toast.error("Falha ao cadastrar educador: " + res.message); return; }
            toast.success("Educador cadastrado com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-16">
                <Spinner size={32} color="#6B7280" />
            </div>
        );
    }

    // Steps visíveis na barra de progresso (edição não tem bio nem senha)
    const totalSteps = isEditMode ? 3 : 5;

    // Em edição: salvar direto de qualquer step, desde que tudo esteja válido
    const isFormValid = !!kind && isStep1Valid && isStep2Valid();
    const editSaveButton = isEditMode && view !== 2 && (
        <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!isFormValid || loading}
            loading={loading}
            loadingText="Salvando..."
            onClick={handleSubmit}
        >
            Salvar alterações
        </Button>
    );

    return (
        <form onSubmit={handleStepSubmit} className="flex flex-col gap-6">
            <ProgressBar
                currentStep={view}
                totalSteps={totalSteps}
                onStepClick={isEditMode ? setView : undefined}
            />

            {/* Step 0: escolher tipo */}
            {view === 0 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            {isEditMode ? "Editar educador" : "Cadastrar educador"}
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            {isEditMode ? "Ajuste o tipo e as permissões do educador." : "Selecione o tipo de educador que deseja cadastrar."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setKind("educator")}
                            className={`flex items-center justify-between gap-2 rounded-3xl px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 border-2 bg-salmon-100 text-salmon-800 ${kind === "educator" ? "border-current/50" : "border-transparent opacity-90"}`}
                        >
                            <div>
                                <p className="text-lg font-bold">Professor</p>
                                <p className="mt-1 text-sm font-medium opacity-90">Gestão de turmas e sinais</p>
                            </div>
                            <img src="/src/assets/images/educator.png" alt="" className="w-14 h-14 shrink-0" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setKind("interpreter")}
                            className={`flex items-center justify-between gap-2 rounded-3xl px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 border-2 bg-campfire-100 text-campfire-800 ${kind === "interpreter" ? "border-current/50" : "border-transparent opacity-90"}`}
                        >
                            <div>
                                <p className="text-lg font-bold">Intérprete</p>
                                <p className="mt-1 text-sm font-medium opacity-90">Criação de sinais e apoio aos estudantes</p>
                            </div>
                            <img src="/src/assets/images/interpreter.png" alt="" className="w-14 h-14 shrink-0" />
                        </button>
                    </div>

                    {/* Acesso de gestor — ocupa a linha inteira */}
                    <InputCheckbox
                        id="edu-manager"
                        icon={StarAward01Icon}
                        checked={isManager}
                        onChange={setIsManager}
                        title="Conceder acesso de gestor"
                        description="Pode cadastrar educadores e gerenciar membros."
                    />

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
                        {editSaveButton}
                        <Button type="submit" className="flex-1" disabled={!kind}>Próximo</Button>
                    </div>
                </>
            )}

            {/* Step 1: dados pessoais */}
            {view === 1 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Dados pessoais</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Informe nome e contato do educador.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edu-name" isRequired>Nome:</Label>
                            <Input id="edu-name" icon={LocationUser01Icon} placeholder="Nome completo" value={name} noSpecialChars onChange={setName} autoFocus />
                            {name.trim() !== "" && !nameValid && (
                                <p className="text-xs text-neutral-400 pl-1">O nome precisa ter pelo menos 3 caracteres.</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edu-email" isRequired>E-mail:</Label>
                            <Input id="edu-email" icon={MailOpenLoveIcon} placeholder="educador@email.com" value={email} onChange={setEmail} />
                            {email.trim() !== "" && !emailValid && (
                                <p className="text-xs text-neutral-400 pl-1">Digite um e-mail válido.</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edu-phone" isOptional>Telefone:</Label>
                            <Input id="edu-phone" icon={SmartPhone01Icon} placeholder="(31) 99999-9999" value={phone} onChange={(v) => setPhone(maskPhone(v))} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(0)} />
                        {editSaveButton}
                        <Button type="submit" className="flex-1" disabled={!isStep1Valid}>Próximo</Button>
                    </div>
                </>
            )}

            {/* Step 2: dados do perfil */}
            {view === 2 && formulario && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">{formulario.titulo}</h2>
                        <p className="text-sm text-cloud-400 leading-snug">{formulario.descricao}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {formulario.campos.map((campo) => (
                            <div key={campo.id} className="flex flex-col gap-1.5">
                                <Label htmlFor={campo.id} isRequired={!campo.optional} isOptional={campo.optional}>{campo.label}</Label>
                                {campo.kind === "select" ? (
                                    <Select
                                        id={campo.id}
                                        icon={campo.icon}
                                        value={dadosPerfil[campo.id] || ""}
                                        onChange={(value) => handleProfileChange(campo.id, value)}
                                        options={campo.options || []}
                                    />
                                ) : (
                                    <Input
                                        id={campo.id}
                                        icon={campo.icon}
                                        type={campo.type}
                                        placeholder={campo.placeholder}
                                        value={dadosPerfil[campo.id] || ""}
                                        noSpecialChars={campo.noSpecialChars}
                                        onChange={(value) => handleProfileChange(campo.id, value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(1)} />
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={isEditMode && loading}
                            loadingText="Salvando..."
                            disabled={!isStep2Valid() || (isEditMode && loading)}
                        >
                            {isEditMode ? "Salvar alterações" : "Próximo"}
                        </Button>
                    </div>
                </>
            )}

            {/* Step 3: biografia (só criação) */}
            {view === 3 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Biografia</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Conte um pouco sobre o educador. Este passo é opcional.</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edu-bio" isOptional>Biografia:</Label>
                        <InputText id="edu-bio" icon={PenTool03Icon} placeholder="Breve descrição do educador (opcional)." value={bio} onChange={setBio} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(2)} />
                        <Button type="submit" className="flex-1">Próximo</Button>
                    </div>
                </>
            )}

            {/* Step 4: senha (só criação) */}
            {view === 4 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Senha de acesso</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Defina a senha inicial. O educador poderá alterá-la depois.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edu-password" isRequired>Senha:</Label>
                            <Input id="edu-password" icon={CirclePasswordIcon} type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={setPassword} />
                            {password.trim() !== "" && !passwordValid && (
                                <p className="text-xs text-neutral-400 pl-1">A senha precisa ter pelo menos 6 caracteres.</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edu-confirm" isRequired>Confirmar senha:</Label>
                            <Input id="edu-confirm" icon={CirclePasswordIcon} type="password" placeholder="Repita a senha" value={confirmPassword} onChange={setConfirmPassword} />
                            {confirmPassword.trim() !== "" && !passwordsMatch && (
                                <p className="text-xs text-neutral-400 pl-1">As senhas não coincidem.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <BackButton onClick={() => setView(3)} />
                        <Button type="submit" className="flex-1" loading={loading} loadingText="Cadastrando..." disabled={!isStep3Valid || loading}>
                            Cadastrar educador
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};

export default EducatorForm;
