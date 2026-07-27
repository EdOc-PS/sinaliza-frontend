import { useNavigate } from "react-router-dom";

import Button from "@components/ui/Button";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import ifmgLogo from "@/assets/images/logo/ifmg-vertical.png";

// "Sobre o projeto" — contexto acadêmico do TCC + CTA final
export const LandingAbout = () => {
    const navigate = useNavigate();

    return (
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

                <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Texto */}
                    <div className="reveal">
                        <h3 className="font-baskerville text-2xl font-bold text-cloud-500">Por que <span className="font-baskerville text-lime-500">Sinaliza</span> ?</h3>

                        <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-cloud-400">
                            <p>
                                O Sinaliza é um projeto desenvolvido como Trabalho de Conclusão de Curso no{" "}
                                <strong className="text-cloud-500">Instituto Federal de Minas Gerais (IFMG) — Campus Ouro Branco</strong>,
                                por <strong className="text-cloud-500">Eduardo Octavio</strong>.
                            </p>
                            <p>
                                A proposta é criar uma ponte acessível entre intérpretes de Libras, alunos, professores
                                e familiares democratizando o acesso ao aprendizado da Língua Brasileira de Sinais
                                através de uma plataforma colaborativa, moderna e inclusiva.
                            </p>
                            <p>
                                Acreditamos que a educação em Libras deve ser acessível, organizada e inspiradora para
                                todos os envolvidos no processo de aprendizado.
                            </p>
                        </div>

                    </div>

                    {/* Logo institucional */}
                    <div className="reveal flex items-center justify-center" style={{ transitionDelay: "120ms" }}>
                        <img
                            src={ifmgLogo}
                            alt="Instituto Federal de Minas Gerais"
                            className="w-full max-w-[220px] object-contain"
                        />
                    </div>
                </div>

                {/* CTA final */}
                <div className="reveal relative mt-20 overflow-hidden rounded-3xl p-8 sm:p-12">
                    {/* Fundo estilo Memphis (mesmo do sistema) */}
                    <CardMemphisBackground seed="landing-cta" color="#213547" rounded="rounded-3xl" />

                    <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="font-baskerville text-3xl font-bold leading-tight text-white sm:text-4xl">
                                Pronto para começar
                                <br />
                                sua jornada em Libras?
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                                Crie sua conta gratuitamente e faça parte de uma comunidade comprometida com a
                                inclusão e o aprendizado.
                            </p>
                        </div>

                        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
                            <Button variant="white" onClick={() => navigate("/auth/register")}>
                                Solicitar entrada
                            </Button>
                            <Button variant="outlineWhite" onClick={() => navigate("/auth/login")}>
                                Já tenho conta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingAbout;
