import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChartIcon,
    FavouriteIcon,
    GlobalEducationIcon,
    LibrariesIcon,
    PencilIcon,
    StudentsIcon,
    Time01Icon,
    User03Icon,
    UserMultiple02Icon,
    Key02Icon,
    Video01Icon,
    Search01Icon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";

import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";
import BackButton from "@components/ui/BackButton";
import ProgressBar from "@/components/layout/ProgressBar";
import { getRoleMeta } from "@components/ui/RoleBadge";
import {
    ChangePasswordFields,
    EMPTY_PASSWORD_VALUES,
    isChangePasswordValid,
} from "@components/feature/profile/ChangePasswordFields";

import { useAuth } from "@context/AuthContext";
import { PatchRequest } from "@requests";
import { USERS } from "@routes/users";
import type { User } from "@api/requests";

type IconType = typeof LibrariesIcon;

interface OnboardingStep {
    title: string;
    subtitle: string;
    body: ReactNode;
    /** Espaço reservado para imagem ou GIF ilustrativo — texto e mídia lado a lado no desktop */
    media?: ReactNode;
}

interface NavEntry {
    icon: IconType;
    label: string;
    description: string;
    /** Sem `roles`, aparece para todo mundo */
    roles?: User["roles"];
    admin?: boolean;
}

const NAV_ENTRIES: NavEntry[] = [
    { icon: LibrariesIcon, label: "Turmas", description: "Suas turmas. Entre com um código de convite ou, se for educador, crie as suas." },
    { icon: GlobalEducationIcon, label: "Glossário", description: "Sinais aprovados pela instituição, abertos a todos." },
    { icon: PencilIcon, label: "Ambiente de Trabalho", description: "Seus sinais e o teclado de mãos. Para o gestor, também aprovação de promoções, categorias e disciplinas.", roles: ["EDUCATOR"] },
    { icon: ChartIcon, label: "Métricas", description: "Gráficos de uso da plataforma e sinais candidatos a ir para o glossário.", roles: ["MANAGER"], admin: true },
    { icon: UserMultiple02Icon, label: "Educadores", description: "Cadastre e gerencie professores e intérpretes.", roles: ["MANAGER"], admin: true },
    { icon: StudentsIcon, label: "Alunos", description: "Aprove as contas de alunos que pediram acesso.", roles: ["MANAGER"], admin: true },
    { icon: FavouriteIcon, label: "Favoritos", description: "Os sinais que você salvou para rever depois." },
    { icon: Time01Icon, label: "Histórico", description: "Os últimos sinais que você acessou." },
    { icon: User03Icon, label: "Perfil", description: "Seus dados e sua conta." },
];

// O papel "mais alto" define como a pessoa é apresentada — mesmo ícone/cor do RoleBadge
// (o de gestor é o mesmo StarAward01Icon usado no checkbox "Conceder acesso de gestor" do EducatorForm)
const getPrimaryRoleMeta = (user: User) => {
    if (user.roles.includes("MANAGER")) return getRoleMeta("MANAGER");
    if (user.roles.includes("EDUCATOR")) return getRoleMeta("EDUCATOR", user.educatorType);
    return getRoleMeta("STUDENT");
};

const NavRow = ({ entry }: { entry: NavEntry }) => (
    <li className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cloud-100 text-cloud-600">
            <HugeiconsIcon icon={entry.icon} size={18} />
        </span>
        <div className="min-w-0">
            <p className="text-sm font-semibold text-cloud-700">{entry.label}</p>
            <p className="text-sm leading-snug text-cloud-500/80">{entry.description}</p>
        </div>
    </li>
);

// Depois das boas-vindas, para quem entrou com a senha temporária do gestor
const PASSWORD_STEP_INDEX = 1;

const buildSteps = (user: User, passwordBody: ReactNode | null, helpOnly: boolean): OnboardingStep[] => {
    const roleMeta = getPrimaryRoleMeta(user);
    const roleLabel = roleMeta.label.toLowerCase();
    const visible = NAV_ENTRIES.filter((e) => !e.roles || e.roles.some((r) => user.roles.includes(r)));
    const general = visible.filter((e) => !e.admin);
    const admin = visible.filter((e) => e.admin);

    const steps: OnboardingStep[] = [
        {
            title: `Olá, ${user.name.split(" ")[0]}`,
            subtitle: "Que bom ter você por aqui",
            body: (
                <div className="flex flex-col gap-4 text-sm leading-relaxed text-cloud-600">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-campfire-100 text-campfire-600">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={30} />
                    </span>
                    <p>
                        Antes de começar, preparamos um tour rápido para você conhecer o Sinaliza
                        e entender como aproveitar melhor a plataforma.
                    </p>
                    <p>Leva menos de um minuto — vamos lá?</p>
                </div>
            ),
        },
        {
            title: "Como funciona o Sinaliza",
            subtitle: "Um repositório colaborativo de sinais em Libras",
            body: (
                <div className="flex flex-col gap-4 text-sm leading-relaxed text-cloud-600">
                    <p>
                        O Sinaliza reúne, num só lugar, os sinais em Libras usados dentro da sala de aula —
                        gravados em vídeo, organizados e fáceis de encontrar.
                    </p>
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-campfire-100 text-campfire-600">
                                <HugeiconsIcon icon={Key02Icon} size={18} />
                            </span>
                            <p><b className="text-cloud-700">Turmas.</b> Professores criam turmas; alunos entram com um código de 6 dígitos. Cada turma tem seus próprios sinais.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                                <HugeiconsIcon icon={Video01Icon} size={18} />
                            </span>
                            <p><b className="text-cloud-700">Sinais em vídeo.</b> Cada sinal tem vídeo, configuração de mão, significado e exemplos de uso.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                <HugeiconsIcon icon={Search01Icon} size={18} />
                            </span>
                            <p><b className="text-cloud-700">Busca visual.</b> Não sabe o nome? Encontre o sinal pela forma da mão.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunflower-100 text-sunflower-700">
                                <HugeiconsIcon icon={GlobalEducationIcon} size={18} />
                            </span>
                            <p><b className="text-cloud-700">Glossário.</b> Sinais validados pela instituição ficam disponíveis para todo mundo.</p>
                        </li>
                    </ul>
                    <p className={`flex items-center rounded-2xl px-4 py-3 font-medium ${roleMeta.className}`}>
                        <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/60">
                            <HugeiconsIcon icon={roleMeta.icon} size={18} />
                        </span>
                        Você está entrando como: 
                        <span className="ml-1 font-semibold capitalize"> {roleLabel}</span>
                    </p>
                </div>
            ),
        },
        {
            title: "Como navegar",
            subtitle: `O que você encontra no menu como ${roleLabel}`,
            body: (
                <div className="flex flex-col gap-5">
                    <ul className="flex flex-col gap-3">
                        {general.map((e) => <NavRow key={e.label} entry={e} />)}
                    </ul>
                    {admin.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-cloud-400">Acessos administrativos</p>
                            <ul className="flex flex-col gap-3">
                                {admin.map((e) => <NavRow key={e.label} entry={e} />)}
                            </ul>
                        </div>
                    )}
                    <p className="text-xs text-cloud-400">
                        Pode rever este tour a qualquer momento pelo botão <b>?</b> no canto superior direito.
                    </p>
                </div>
            ),
        },
    ];

    if (passwordBody) {
        steps.splice(PASSWORD_STEP_INDEX, 0, {
            title: "Crie sua senha",
            subtitle: "Defina sua nova senha. Este passo é obrigatório",
            body: passwordBody,
        });
    }

    // Pelo botão de ajuda, só a explicação da plataforma
    return helpOnly ? steps.slice(1) : steps;
};

interface OnboardingModalProps {
    open: boolean;
    onClose: () => void;
    /** Aberto pelo botão de ajuda: sem boas-vindas e sem senha */
    helpOnly?: boolean;
}

// Tour inicial. Abre sozinho no primeiro login e pode ser reaberto pelo botão de ajuda.
// X e Pular só existem pelo botão de ajuda; no primeiro acesso, o tour termina no "Começar", que o marca como visto.
export const OnboardingModal = ({ open, onClose, helpOnly = false }: OnboardingModalProps) => {
    const { user, getUser, changePassword } = useAuth();
    const [view, setView] = useState(0);
    const [saving, setSaving] = useState(false);
    const [passwords, setPasswords] = useState(EMPTY_PASSWORD_VALUES);
    // Guardado à parte: ao concluir, o usuário perde o flag e a lista de passos não pode mudar no meio do tour
    const [hasPasswordStep, setHasPasswordStep] = useState(false);
    // Troca aprovada pelo gestor: quem já fez o tour vê só o passo da senha
    const [passwordOnly, setPasswordOnly] = useState(false);

    // Sempre começa do primeiro passo ao abrir
    useEffect(() => {
        if (open) {
            setView(0);
            setPasswords(EMPTY_PASSWORD_VALUES);
            setHasPasswordStep(!helpOnly && !!user?.mustChangePassword);
            setPasswordOnly(!helpOnly && !!user?.mustChangePassword && !!user?.onboardingSeenAt);
        }
    }, [open]);

    if (!user) return null;

    const mustChange = !!user.mustChangePassword;
    const passwordBody = !hasPasswordStep ? null : mustChange ? (
        <ChangePasswordFields values={passwords} onChange={setPasswords} />
    ) : (
        <p className="text-sm leading-relaxed text-cloud-600">Senha criada com sucesso. Agora é só continuar.</p>
    );

    const allSteps = buildSteps(user, passwordBody, helpOnly);
    const steps = passwordOnly ? [allSteps[PASSWORD_STEP_INDEX]] : allSteps;
    const step = steps[view];
    const isLast = view === steps.length - 1;
    const onPasswordStep = hasPasswordStep && (passwordOnly || view === PASSWORD_STEP_INDEX);

    const finish = async () => {
        // Com a troca pendente, nenhum caminho fecha o tour
        if (mustChange) return;
        if (user.onboardingSeenAt) {
            onClose();
            return;
        }
        setSaving(true);
        try {
            await PatchRequest(USERS.ONBOARDING(), {});
            await getUser();
        } finally {
            setSaving(false);
            onClose();
        }
    };

    const submitPassword = async () => {
        setSaving(true);
        try {
            await changePassword(passwords.next);
            setPasswords(EMPTY_PASSWORD_VALUES);
            toast.success("Senha criada com sucesso!");
            if (passwordOnly) onClose();
            else setView((v) => v + 1);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Não foi possível alterar a senha");
        } finally {
            setSaving(false);
        }
    };

    // Com a troca pendente, a barra de passos não deixa pular a senha
    const goToStep = (target: number) => {
        if (mustChange && target > PASSWORD_STEP_INDEX) return;
        setView(target);
    };

    const handleNext = () => {
        if (onPasswordStep && mustChange) return submitPassword();
        if (isLast) return finish();
        setView((v) => v + 1);
    };

    return (
        <Modal open={open} onClose={finish} size="2xl" hideClose={!helpOnly}>
            <div className="flex flex-col gap-6">
                <ProgressBar currentStep={view} totalSteps={steps.length} onStepClick={goToStep} />

                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">{step.title}</h2>
                    <p className="text-sm text-cloud-400">{step.subtitle}</p>
                </div>

                {/* Texto à esquerda, mídia (quando houver) à direita; empilha no mobile */}
                <div className={`grid gap-6 ${step.media ? "md:grid-cols-[3fr_2fr]" : ""}`}>
                    <div>{step.body}</div>
                    {step.media && (
                        <div className="flex items-center justify-center rounded-2xl bg-cloud-100/60 p-4">
                            {step.media}
                        </div>
                    )}
                </div>

                                <div className="flex gap-3 pt-2">
                    {view > 0 && <BackButton onClick={() => setView((v) => v - 1)} />}
                    {helpOnly && !isLast && (
                        <Button type="button" variant="outline" className="flex-1" onClick={finish}>
                            Pular
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="cloud"
                        className="flex-1"
                        onClick={handleNext}
                        disabled={onPasswordStep && mustChange && !isChangePasswordValid(passwords)}
                        loading={saving}
                        loadingText="Salvando"
                    >
                        {isLast ? "Começar" : "Próximo"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
