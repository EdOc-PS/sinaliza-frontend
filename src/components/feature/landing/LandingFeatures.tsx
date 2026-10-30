import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    FavouriteIcon,
    Key02Icon,
    Search01Icon,
    TagsIcon,
    Video01Icon,
    WheelchairIcon,
} from "@hugeicons/core-free-icons";

import WordReveal from "./WordReveal";

interface Feature {
    title: string;
    description: string;
    icon: IconSvgElement;
    iconClass: string;
}

const features: Feature[] = [
    {
        title: "Vídeos em Libras",
        description: "Cada sinal tem vídeo, imagem ilustrativa e descrição do movimento.",
        icon: Video01Icon,
        iconClass: "text-salmon-600",
    },
    {
        title: "Busca pela mão",
        description: "Encontre um sinal pela configuração de mão, mesmo sem saber a palavra.",
        icon: Search01Icon,
        iconClass: "text-sky-600",
    },
    {
        title: "Categorias e disciplinas",
        description: "Sinais organizados por tipo (verbo, animal) e por área do conhecimento.",
        icon: TagsIcon,
        iconClass: "text-campfire-600",
    },
    {
        title: "Favoritos e histórico",
        description: "Guarde os sinais que mais usa e volte ao que viu por último.",
        icon: FavouriteIcon,
        iconClass: "text-lime-700",
    },
    {
        title: "Turmas por convite",
        description: "O professor cria a turma e os alunos entram com um código de 6 dígitos.",
        icon: Key02Icon,
        iconClass: "text-sunflower-700",
    },
    {
        title: "Feito para o celular",
        description: "Interface pensada para abrir na sala de aula, com contraste e navegação simples.",
        icon: WheelchairIcon,
        iconClass: "text-cloud-500",
    },
];

// "Recursos" — título fixo à esquerda e lista em duas colunas com linhas finas
export const LandingFeatures = () => (
    <section id="recursos" className="bg-cloud-100 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[4fr_8fr] lg:gap-16 lg:px-8">
            <div>
                <h2 className="reveal font-baskerville text-3xl font-normal leading-tight tracking-tight text-cloud-600 sm:text-5xl lg:sticky lg:top-28">
                    <WordReveal lines={[["O", "que", "vem"], ["junto."]]} />
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {features.map((feature, i) => (
                    <div
                        key={feature.title}
                        className="reveal flex gap-4 border-t border-cloud-300/60 py-7"
                        style={{ transitionDelay: `${(i % 2) * 90}ms` }}
                    >
                        <HugeiconsIcon icon={feature.icon} size={22} className={`mt-0.5 shrink-0 ${feature.iconClass}`} />
                        <div>
                            <h3 className="font-semibold text-cloud-600">{feature.title}</h3>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-cloud-500/75">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingFeatures;
