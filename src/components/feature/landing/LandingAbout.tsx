import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon, MortarboardIcon, Tick02Icon } from "@hugeicons/core-free-icons";

const highlights = ["Inclusão digital", "Educação colaborativa", "Acessibilidade total", "Impacto social"];

// "Sobre o projeto" — contexto acadêmico do TCC
export const LandingAbout = () => (
    <section id="sobre" className="bg-cloud-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Sobre o projeto</span>
                <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                    Uma missão de
                    <br />
                    inclusão e acessibilidade
                </h2>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Texto */}
                <div className="reveal">
                    <h3 className="font-baskerville text-2xl font-bold text-cloud-500">Por que Sinaliza?</h3>

                    <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-cloud-400">
                        <p>
                            O Sinaliza é um projeto desenvolvido como Trabalho de Conclusão de Curso no{" "}
                            <strong className="text-cloud-500">Instituto Federal de Minas Gerais (IFMG) — Campus Ouro Branco</strong>,
                            por <strong className="text-cloud-500">Eduardo Octavio</strong>.
                        </p>
                        <p>
                            A proposta é criar uma ponte acessível entre intérpretes de Libras, alunos, professores
                            e familiares — democratizando o acesso ao aprendizado da Língua Brasileira de Sinais
                            através de uma plataforma colaborativa, moderna e inclusiva.
                        </p>
                        <p>
                            Acreditamos que a educação em Libras deve ser acessível, organizada e inspiradora para
                            todos os envolvidos no processo de aprendizado.
                        </p>
                    </div>

                    <div className="mt-7 flex gap-3 rounded-2xl border-l-4 border-lime-500 bg-lime-100 p-5">
                        <HugeiconsIcon icon={Award01Icon} size={22} className="mt-0.5 shrink-0 text-lime-700" />
                        <div>
                            <p className="font-bold text-cloud-600">Projeto Acadêmico</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-cloud-500/80">
                                Desenvolvido como TCC no IFMG Campus Ouro Branco com o objetivo de impactar
                                positivamente a educação em Libras no Brasil.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card institucional */}
                <div className="reveal flex items-center justify-center" style={{ transitionDelay: "120ms" }}>
                    <div className="float-slow w-full max-w-sm rounded-3xl bg-gradient-to-br from-sky-100 via-white to-campfire-100 p-8 text-center shadow-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-cloud-500 shadow-sm">
                            <HugeiconsIcon icon={Award01Icon} size={16} className="text-campfire-600" />
                            Trabalho de Conclusão de Curso
                        </span>

                        <div className="mt-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cloud-500">
                                <HugeiconsIcon icon={MortarboardIcon} size={32} className="text-white" />
                            </div>
                        </div>

                        <h3 className="mt-5 font-baskerville text-2xl font-bold text-cloud-600">IFMG Ouro Branco</h3>
                        <p className="mt-1 text-sm text-cloud-400">Instituto Federal de Minas Gerais</p>

                        <div className="mt-7 flex flex-col gap-3 text-left">
                            {highlights.map((item) => (
                                <div key={item} className="flex items-center gap-2.5">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-500">
                                        <HugeiconsIcon icon={Tick02Icon} size={14} className="text-white" />
                                    </span>
                                    <span className="text-sm font-medium text-cloud-500">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default LandingAbout;
