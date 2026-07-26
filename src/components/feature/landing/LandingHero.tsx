import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, PlayIcon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import AuthBackground from "@components/layout/AuthBackground";

interface LandingHeroProps {
    /** Total de sinais públicos — exibido como prova social */
    signCount?: number;
    categoryCount?: number;
}

// Hero da landing: fundo de ondas (AuthBackground) + CTA + mockup do repositório
export const LandingHero = ({ signCount, categoryCount }: LandingHeroProps) => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
            <AuthBackground variant="contained" decorations />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Texto + CTA */}
                    <div className="fade-up flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h1 className="font-baskerville text-4xl font-bold leading-tight text-cloud-500 sm:text-5xl lg:text-6xl">
                            Libras ao alcance
                            <br />
                            de <span className="italic text-campfire-500">todos</span>
                        </h1>

                        <p className="mt-5 max-w-md text-base leading-relaxed text-cloud-400 sm:text-lg">
                            Um repositório colaborativo de sinais que conecta intérpretes, alunos,
                            professores e familiares dentro da sala de aula.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => navigate("/public-glossary")}
                                className="flex items-center justify-center gap-2 rounded-3xl bg-cloud-500 px-7 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-cloud-600"
                            >
                                Explorar o repositório
                                <HugeiconsIcon icon={SignLanguageCIcon} size={20} />
                            </button>
                            <button
                                onClick={() => navigate("/auth/register")}
                                className="rounded-3xl border-2 border-cloud-500 px-7 py-4 font-bold text-cloud-500 transition-all hover:-translate-y-0.5 hover:bg-white"
                            >
                                Criar conta grátis
                            </button>
                        </div>

                        {/* Prova social */}
                        {!!signCount && (
                            <div className="mt-9 flex items-center gap-8">
                                <div>
                                    <p className="font-baskerville text-3xl font-bold text-cloud-500">{signCount}</p>
                                    <p className="text-sm text-cloud-400">sinais públicos</p>
                                </div>
                                <div className="h-10 w-px bg-cloud-300" />
                                <div>
                                    <p className="font-baskerville text-3xl font-bold text-cloud-500">{categoryCount ?? 0}</p>
                                    <p className="text-sm text-cloud-400">categorias</p>
                                </div>
                                <div className="h-10 w-px bg-cloud-300" />
                                <div>
                                    <p className="font-baskerville text-3xl font-bold text-cloud-500">4</p>
                                    <p className="text-sm text-cloud-400">perfis de acesso</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mockup do celular */}
                    <div className="fade-up flex justify-center lg:justify-end" style={{ animationDelay: "0.15s" }}>
                        <div className="float-slow relative w-[260px] sm:w-[300px]">
                            {/* Moldura */}
                            <div className="rounded-[2.5rem] border-[10px] border-cloud-600 bg-white shadow-2xl">
                                <div className="overflow-hidden rounded-[1.8rem]">
                                    {/* Banner interno */}
                                    <div className="bg-lime-500 p-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/25">
                                            <HugeiconsIcon icon={SignLanguageCIcon} size={18} className="text-white" />
                                        </div>
                                        <p className="mt-2.5 font-baskerville text-base font-bold text-white">Glossário Global</p>
                                        <p className="text-[11px] text-white/85">Sinais validados pela instituição</p>
                                    </div>

                                    {/* Lista fake de sinais */}
                                    <div className="flex flex-col gap-2.5 p-3.5">
                                        {[
                                            { name: "Carro", cat: "Veículo", color: "bg-sky-100 text-sky-700" },
                                            { name: "Escola", cat: "Lugar", color: "bg-lime-100 text-lime-700" },
                                            { name: "Aprender", cat: "Verbo", color: "bg-campfire-100 text-campfire-700" },
                                        ].map((s, i) => (
                                            <div
                                                key={s.name}
                                                className="flex items-center gap-2.5 rounded-xl bg-cloud-100 p-2"
                                                style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                                            >
                                                <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-cloud-500">
                                                    <HugeiconsIcon icon={PlayIcon} size={14} className="text-white/80" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-bold text-cloud-600">{s.name}</p>
                                                    <span className={`rounded-md px-1.5 text-[10px] font-semibold ${s.color}`}>
                                                        {s.cat}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card flutuante */}
                            <div
                                className="float-medium absolute -left-6 bottom-16 hidden rounded-2xl bg-white p-3 shadow-xl sm:block"
                                style={{ animationDelay: "0.6s" }}
                            >
                                <p className="text-[11px] font-bold text-cloud-600">Busca por mão</p>
                                <div className="mt-1.5 grid grid-cols-4 gap-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="h-4 w-4 rounded bg-campfire-200" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicador de scroll */}
                <div className="mt-14 flex justify-center">
                    <a
                        href="#para-quem"
                        aria-label="Rolar para o conteúdo"
                        className="bounce-down flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-cloud-100"
                    >
                        <HugeiconsIcon icon={ArrowDown01Icon} size={22} className="text-cloud-500" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LandingHero;
