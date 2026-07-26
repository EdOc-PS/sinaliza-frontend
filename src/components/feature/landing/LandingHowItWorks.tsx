import { HugeiconsIcon } from "@hugeicons/react";
import { ChartLineData01Icon, SignLanguageCIcon, SquareLock02Icon } from "@hugeicons/core-free-icons";

const steps = [
    {
        title: "Crie sua conta",
        description: "Cadastre-se escolhendo seu perfil — intérprete, aluno, professor ou familiar. Cada perfil tem acesso personalizado.",
    },
    {
        title: "Explore o repositório",
        description: "Navegue pelos sinais organizados por categoria, disciplina ou configuração de mão. Assista aos vídeos em Libras.",
    },
    {
        title: "Contribua e evolua",
        description: "Intérpretes e professores cadastram novos sinais, que passam por validação do gestor antes de virarem públicos.",
    },
    {
        title: "Aprenda junto",
        description: "A plataforma conecta todos os perfis para criar uma rede de aprendizado colaborativo e inclusivo em Libras.",
    },
];

// "Como funciona" — passos numerados + cards de destaque
export const LandingHowItWorks = () => (
    <section id="como-funciona" className="bg-cloud-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
                {/* Passos */}
                <div>
                    <div className="reveal">
                        <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Como funciona</span>
                        <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                            Simples do início
                            <br />
                            ao fim
                        </h2>
                        <p className="mt-4 max-w-md text-base text-cloud-400">
                            Em poucos passos você cria sua conta, encontra seu perfil e começa a usar a plataforma.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col gap-7">
                        {steps.map((step, i) => (
                            <div
                                key={step.title}
                                className="reveal flex gap-4"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud-500 text-sm font-bold text-white">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div>
                                    <h3 className="font-bold text-cloud-600">{step.title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-cloud-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cards de destaque */}
                <div className="flex flex-col gap-4">
                    <div className="reveal rounded-3xl bg-cloud-500 p-7 transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                            <HugeiconsIcon icon={SignLanguageCIcon} size={22} className="text-white" />
                        </div>
                        <h3 className="mt-4 font-bold text-white">Repositório colaborativo</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                            Sinais criados por educadores e intérpretes, com vídeo, configuração de mão e
                            exemplos de uso para cada sinal da Língua Brasileira de Sinais.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="reveal rounded-3xl bg-lime-100 p-6 transition-transform duration-300 hover:-translate-y-1" style={{ transitionDelay: "80ms" }}>
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400">
                                <HugeiconsIcon icon={ChartLineData01Icon} size={22} className="text-white" />
                            </div>
                            <h3 className="mt-4 font-bold text-cloud-600">Acompanhamento</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-cloud-500/80">
                                Professores e familiares acompanham o histórico de acesso e os favoritos do aluno.
                            </p>
                        </div>

                        <div className="reveal rounded-3xl bg-campfire-100 p-6 transition-transform duration-300 hover:-translate-y-1" style={{ transitionDelay: "160ms" }}>
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-campfire-400">
                                <HugeiconsIcon icon={SquareLock02Icon} size={22} className="text-white" />
                            </div>
                            <h3 className="mt-4 font-bold text-cloud-600">Acesso por perfil</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-cloud-500/80">
                                Cada usuário vê exatamente o que precisa, sem complexidade desnecessária.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default LandingHowItWorks;
