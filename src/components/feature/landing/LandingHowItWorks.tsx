import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    CheckmarkBadge01Icon,
    Mail01Icon,
    Search01Icon,
    SignLanguageCIcon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";

import WordReveal from "./WordReveal";

interface Step {
    title: string;
    description: string;
    panel: string;
    icon: IconSvgElement;
    iconClass: string;
    mock: { label: string; value: string }[];
}

const steps: Step[] = [
    {
        title: "Solicite sua conta",
        description: "O aluno cria a conta e um gestor libera o acesso. Professores e intérpretes são cadastrados pelo gestor.",
        panel: "bg-sky-100",
        icon: Mail01Icon,
        iconClass: "bg-sky-200 text-sky-600",
        mock: [
            { label: "Nome", value: "Ana Clara" },
            { label: "Perfil", value: "Aluno" },
            { label: "Status", value: "Aguardando análise" },
        ],
    },
    {
        title: "Encontre o sinal",
        description: "Busque pela palavra, pela categoria ou pela configuração de mão, mesmo sem saber o termo em português.",
        panel: "bg-campfire-100",
        icon: Search01Icon,
        iconClass: "bg-campfire-200 text-campfire-600",
        mock: [
            { label: "Busca", value: "fotossíntese" },
            { label: "Categoria", value: "Biologia" },
            { label: "Mão", value: "Configuração 14" },
        ],
    },
    {
        title: "Contribua com a turma",
        description: "Intérpretes e professores cadastram sinais com vídeo e exemplo. O gestor aprova antes de virar público.",
        panel: "bg-lime-100",
        icon: CheckmarkBadge01Icon,
        iconClass: "bg-lime-200 text-lime-700",
        mock: [
            { label: "Sinal", value: "Célula" },
            { label: "Vídeo", value: "celula.mp4" },
            { label: "Glossário", value: "Aprovado" },
        ],
    },
    {
        title: "Aprendam juntos",
        description: "Turmas por código de convite, favoritos e histórico para retomar o que cada aluno está estudando.",
        panel: "bg-salmon-100",
        icon: UserGroupIcon,
        iconClass: "bg-salmon-200 text-salmon-600",
        mock: [
            { label: "Turma", value: "Biologia — 2º ano" },
            { label: "Código", value: "K7M2QX" },
            { label: "Alunos", value: "28 participantes" },
        ],
    },
];

// "Como funciona" — no desktop a seção fica fixada enquanto se rola: a lista de
// passos à esquerda avança com a barra de progresso e o painel à direita troca.
// No mobile vira uma lista simples.
export const LandingHowItWorks = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [progress, setProgress] = useState(0);

    function updateProgress() {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
    }

    function listenScroll() {
        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }

    useEffect(() => listenScroll(), []);

    // Posição dentro dos passos: parte inteira = passo ativo, fração = barra
    const position = Math.min(progress * steps.length, steps.length - 0.0001);
    const active = Math.floor(position);
    const stepFill = position - active;
    const current = steps[active];

    return (
        <section
            id="como-funciona"
            ref={sectionRef}
            className="relative bg-white lg:h-[340vh]"
        >
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
                <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:px-8 lg:py-0">
                    {/* Passos */}
                    <div className="flex flex-col justify-center">
                        <h2 className="reveal font-baskerville text-3xl font-semibold leading-tight tracking-tight text-cloud-600 sm:text-5xl">
                            <WordReveal lines={[["Do", "pedido"], ["à", "sala", "de", "aula."]]} />
                        </h2>

                        <ol className="mt-12 flex flex-col">
                            {steps.map((step, i) => {
                                const isActive = i === active;
                                const fill = i < active ? 1 : isActive ? stepFill : 0;

                                return (
                                    <li key={step.title} className="border-t border-cloud-200 py-5 first:border-t-0">
                                        {/* Barra de progresso do passo (só desktop) */}
                                        <div className="mb-4 hidden h-0.5 w-24 overflow-hidden rounded-full bg-cloud-200 lg:block">
                                            <div
                                                className="h-full origin-left bg-campfire-500"
                                                style={{ transform: `scaleX(${fill})` }}
                                            />
                                        </div>

                                        <div className="flex items-baseline gap-4">
                                            <span className="font-baskerville font-semibold text-sm text-cloud-400">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <div>
                                                <h3
                                                    className={`text-lg font-semibold transition-colors duration-500 ${isActive ? "text-cloud-600" : "text-cloud-600 lg:text-cloud-400"}`}
                                                >
                                                    {step.title}
                                                </h3>
                                                <p
                                                    className={`overflow-hidden text-sm sm:text-base leading-relaxed text-cloud-500/75 transition-all duration-500 ease-out ${isActive ? "mt-2 lg:max-h-32 lg:opacity-100" : "mt-2 lg:mt-0 lg:max-h-0 lg:opacity-0"}`}
                                                >
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* Painel ilustrativo (só desktop) */}
                    <div className="hidden lg:block">
                        <div
                            className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] transition-colors duration-700 ease-out ${current.panel}`}
                        >
                            <div key={active} className="pop-in w-[68%] rounded-3xl bg-white p-6 shadow-xl shadow-cloud-600/10">
                                <div className="flex items-center justify-between">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${current.iconClass}`}>
                                        <HugeiconsIcon icon={current.icon} size={22} />
                                    </div>
                                    <span className="font-baskerville font-semibold text-sm text-cloud-400">
                                        {active + 1}/{steps.length}
                                    </span>
                                </div>

                                <p className="mt-5 font-baskerville font-semibold text-xl text-cloud-600">{current.title}</p>

                                <dl className="mt-5 flex flex-col">
                                    {current.mock.map((row) => (
                                        <div key={row.label} className="flex items-center justify-between border-t border-cloud-200 py-3 text-sm">
                                            <dt className="text-cloud-400">{row.label}</dt>
                                            <dd className="font-semibold text-cloud-600">{row.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <HugeiconsIcon
                                icon={SignLanguageCIcon}
                                size={180}
                                className="pointer-events-none absolute -bottom-10 -right-8 text-white/50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingHowItWorks;
