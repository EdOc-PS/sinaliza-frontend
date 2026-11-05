import { Link, useNavigate } from "react-router-dom";

import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import ifmgLogo from "@/assets/images/logo/ifmg-vertical.png";
import WordReveal from "./WordReveal";

// "Sobre o projeto" — citação grande, contexto do TCC e CTA final
export const LandingAbout = () => {
    const navigate = useNavigate();

    return (
        <section id="sobre" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Citação */}
                <figure className="reveal max-w-4xl">
                    <blockquote className="relative font-baskerville text-2xl font-semibold leading-snug tracking-tight text-cloud-600 sm:text-4xl">
                        <span className="font-baskerville absolute -left-5 -top-1 text-campfire-500 sm:-left-7">“</span>
                        A educação em Libras deve ser acessível, organizada e inspiradora para todo
                        mundo que está na sala de aula.
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-cloud-400">
                        <strong className="font-semibold text-cloud-600">Eduardo Octavio</strong> · Autor do Sinaliza
                    </figcaption>
                </figure>

                {/* Contexto do projeto */}
                <div className="mt-24 grid gap-10 border-t border-cloud-200 pt-12 md:grid-cols-[1fr_auto] md:items-center md:gap-x-12 md:gap-y-6">
                    <h3 className="reveal font-baskerville font-semibold md:col-span-2 text-2xl text-cloud-600">
                        Por que <em className="font-baskerville text-lime-500">Sinaliza</em>?
                    </h3>

                    <div className="reveal flex max-w-3xl flex-col gap-4 text-sm sm:text-base leading-relaxed text-cloud-500/75" style={{ transitionDelay: "90ms" }}>
                        <p>
                            O Sinaliza nasceu como Trabalho de Conclusão de Curso no{" "}
                            <strong className="font-semibold text-cloud-600">IFMG — Campus Ouro Branco</strong>.
                        </p>
                        <p>
                            A ideia é ligar intérpretes, alunos e professores num lugar só, onde os sinais usados
                            em cada disciplina ficam guardados, organizados e fáceis de achar no celular.
                        </p>
                    </div>

                    <img
                        src={ifmgLogo}
                        alt="Instituto Federal de Minas Gerais"
                        className="reveal w-28 object-contain md:w-32"
                        style={{ transitionDelay: "180ms" }}
                    />
                </div>

                {/* CTA final */}
                <div className="reveal relative mt-24 overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-24">
                    <CardMemphisBackground seed="landing-cta" color="#213547" rounded="rounded-[2rem]" />

                    <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
                        <h2 className="font-baskerville text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                            <WordReveal lines={[["Comece", "pelo"], ["primeiro", "sinal."]]} />
                        </h2>
                        <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-white/70">
                            Solicite sua entrada ou explore o repositório público agora mesmo.
                        </p>

                        <div className="mt-9 flex flex-col items-center gap-5 sm:flex-row">
                            <button
                                onClick={() => navigate("/auth/register")}
                                className="rounded-full bg-campfire-500 px-6 py-3.5 text-sm font-semibold text-cloud-700 transition-colors duration-300 ease-out hover:bg-campfire-600"
                            >
                                Solicitar entrada
                            </button>
                            <Link
                                to="/auth/login"
                                className="text-sm font-semibold text-white/80 underline-offset-4 transition-colors duration-300 ease-out hover:text-white hover:underline"
                            >
                                Já tenho conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingAbout;
