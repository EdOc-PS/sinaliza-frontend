import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    FavouriteIcon,
    Search01Icon,
    TagsIcon,
    Video01Icon,
    WheelchairIcon,
    Home01Icon,
} from "@hugeicons/core-free-icons";

interface Feature {
    title: string;
    description: string;
    icon: IconSvgElement;
    iconClass: string;
}

const features: Feature[] = [
    {
        title: "Vídeos em Libras",
        description: "Cada sinal possui vídeo demonstrativo, imagem ilustrativa e descrição do movimento.",
        icon: Video01Icon,
        iconClass: "bg-salmon-100 text-salmon-600",
    },
    {
        title: "Busca visual por mão",
        description: "Encontre um sinal pela configuração de mão, mesmo sem saber a palavra em português.",
        icon: Search01Icon,
        iconClass: "bg-sky-100 text-sky-600",
    },
    {
        title: "Categorias e disciplinas",
        description: "Sinais organizados por tipo (verbo, animal) e por área do conhecimento.",
        icon: TagsIcon,
        iconClass: "bg-campfire-100 text-campfire-600",
    },
    {
        title: "Favoritos e histórico",
        description: "Salve os sinais que mais usa e retome rapidamente o que acessou recentemente.",
        icon: FavouriteIcon,
        iconClass: "bg-lime-100 text-lime-700",
    },
    {
        title: "Área da família",
        description: "Familiares acompanham o desenvolvimento do aluno e praticam os sinais em casa.",
        icon: Home01Icon,
        iconClass: "bg-sunflower-100 text-sunflower-700",
    },
    {
        title: "Design acessível",
        description: "Interface mobile-first pensada para inclusão, com foco em contraste e navegação simples.",
        icon: WheelchairIcon,
        iconClass: "bg-cloud-200 text-cloud-600",
    },
];

// "Recursos" — grid de funcionalidades
export const LandingFeatures = () => (
    <section id="recursos" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal mx-auto max-w-2xl text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Recursos</span>
                <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                    Tudo que você precisa
                    <br />
                    em um só lugar
                </h2>
                <p className="mt-4 text-base text-cloud-400">
                    A plataforma foi pensada para ser simples de usar e poderosa para quem ensina e
                    aprende Libras.
                </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, i) => (
                    <div key={feature.title} className="reveal" style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                        <div className="h-full rounded-3xl border-2 border-cloud-200 p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cloud-300">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconClass}`}>
                                <HugeiconsIcon icon={feature.icon} size={24} />
                            </div>
                            <h3 className="mt-4 font-bold text-cloud-600">{feature.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-cloud-400">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingFeatures;
