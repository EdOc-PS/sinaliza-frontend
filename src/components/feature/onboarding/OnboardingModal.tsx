import { useEffect, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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
} from "@hugeicons/core-free-icons";

import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";
import BackButton from "@components/ui/BackButton";
import ProgressBar from "@/components/layout/ProgressBar";
import { getRoleMeta } from "@components/ui/RoleBadge";

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
    { icon: PencilIcon, label: "Ambiente de Trabalho", description: "Cadastre sinais, configurações de mão e categorias.", roles: ["EDUCATOR"] },
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

const buildSteps = (user: User): OnboardingStep[] => {
    const roleMeta = getPrimaryRoleMeta(user);
    const roleLabel = roleMeta.label.toLowerCase();
    const visible = NAV_ENTRIES.filter((e) => !e.roles || e.roles.some((r) => user.roles.includes(r)));
    const general = visible.filter((e) => !e.admin);
    const admin = visible.filter((e) => e.admin);

    return [
        {
            title: "Bem-vindo ao Sinaliza",
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
                        <span className="ml-1 font-bold capitalize"> {roleLabel}</span>
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
};

interface OnboardingModalProps {
    open: boolean;
    onClose: () => void;
}

// Tour inicial. Abre sozinho no primeiro login e pode ser reaberto pelo botão de ajuda.
// Fechar por qualquer caminho (concluir, pular ou o X) marca o tour como visto.
export const OnboardingModal = ({ open, onClose }: OnboardingModalProps) => {
    const { user, getUser } = useAuth();
    const [view, setView] = useState(0);
    const [saving, setSaving] = useState(false);

    // Sempre começa do primeiro passo ao abrir
    useEffect(() => {
        if (open) setView(0);
    }, [open]);

    if (!user) return null;

    const steps = buildSteps(user);
    const step = steps[view];
    const isLast = view === steps.length - 1;

    const finish = async () => {
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

    return (
        <Modal open={open} onClose={finish} size="2xl">
            <div className="flex flex-col gap-6">
                <ProgressBar currentStep={view} totalSteps={steps.length} onStepClick={setView} />

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

                {/* Mesmo padrão de navegação do modal de criar educador: primeiro passo tem
                    Pular + Próximo lado a lado; a partir do segundo, BackButton fixo + ação principal */}
                <div className="flex gap-3 pt-2">
                    {view === 0 ? (
                        <>
                            <Button type="button" variant="outline" className="flex-1" onClick={finish} disabled={saving}>
                                Pular
                            </Button>
                            <Button type="button" variant="cloud" className="flex-1" onClick={() => setView((v) => v + 1)}>
                                Próximo
                            </Button>
                        </>
                    ) : (
                        <>
                            <BackButton onClick={() => setView((v) => v - 1)} />
                            <Button
                                type="button"
                                variant="cloud"
                                className="flex-1"
                                onClick={isLast ? finish : () => setView((v) => v + 1)}
                                loading={saving}
                                loadingText="Salvando"
                            >
                                {isLast ? "Começar" : "Próximo"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};
