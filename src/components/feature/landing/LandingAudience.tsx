import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    HandPrayerIcon,
    Home01Icon,
    MortarboardIcon,
    UserMultiple02Icon,
} from "@hugeicons/core-free-icons";

interface Audience {
    tag: string;
    title: string;
    description: string;
    icon: IconSvgElement;
    cardClass: string;
    iconClass: string;
}

const audiences: Audience[] = [
    {
        tag: "Criador de conteúdo",
        title: "Intérprete",
        description: "Cadastra sinais, sobe vídeos e descrições, organiza o repositório e garante a qualidade do conteúdo em Libras.",
        icon: HandPrayerIcon,
        cardClass: "bg-lime-100",
        iconClass: "bg-lime-400 text-white",
    },
    {
        tag: "Aprendiz",
        title: "Aluno",
        description: "Acessa o repositório de sinais, assiste aos vídeos, favorita os que mais usa e aprende no próprio ritmo.",
        icon: MortarboardIcon,
        cardClass: "bg-sky-100",
        iconClass: "bg-sky-400 text-white",
    },
    {
        tag: "Gestor",
        title: "Professor",
        description: "Gerencia turmas, cadastra sinais na disciplina, valida conteúdos e acompanha o percurso de aprendizado.",
        icon: UserMultiple02Icon,
        cardClass: "bg-campfire-100",
        iconClass: "bg-campfire-400 text-white",
    },
    {
        tag: "Apoio",
        title: "Familiar",
        description: "Acompanha a evolução do aluno, acessa os sinais das disciplinas e participa do processo de inclusão.",
        icon: Home01Icon,
        cardClass: "bg-salmon-100",
        iconClass: "bg-salmon-400 text-white",
    },
];

// "Para quem é" — os 4 perfis da plataforma
export const LandingAudience = () => (
    <section id="para-quem" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Cabeçalho */}
            <div className="reveal mx-auto max-w-2xl text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Para quem é</span>
                <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                    Uma plataforma para
                    <br />
                    cada papel na educação
                </h2>
                <p className="mt-4 text-base text-cloud-400">
                    Do intérprete que cria ao familiar que apoia — o Sinaliza conecta todos os
                    envolvidos no aprendizado de Libras.
                </p>
            </div>

            {/* Cards */}
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {audiences.map((item, i) => (
                    <div
                        key={item.title}
                        className={`reveal flex flex-col gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5 ${item.cardClass}`}
                        style={{ transitionDelay: `${i * 90}ms` }}
                    >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconClass}`}>
                            <HugeiconsIcon icon={item.icon} size={24} />
                        </div>

                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-cloud-400">
                                {item.tag}
                            </span>
                            <h3 className="font-baskerville text-xl font-bold text-cloud-600">{item.title}</h3>
                        </div>

                        <p className="text-sm leading-relaxed text-cloud-500/80">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingAudience;
