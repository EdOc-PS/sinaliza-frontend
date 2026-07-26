import { useNavigate } from "react-router-dom";

// CTA final — card escuro antes do rodapé
export const LandingCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="reveal relative overflow-hidden rounded-3xl bg-cloud-500 p-8 sm:p-12">
                    {/* Círculos decorativos */}
                    <div className="float-slow absolute -right-10 -top-16 h-56 w-56 rounded-full bg-lime-500/10" />
                    <div className="float-medium absolute -bottom-20 left-16 h-44 w-44 rounded-full bg-sky-400/10" />

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

                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                            <button
                                onClick={() => navigate("/auth/register")}
                                className="rounded-3xl bg-white px-7 py-4 font-bold text-cloud-500 transition-all hover:-translate-y-0.5 hover:bg-cloud-100"
                            >
                                Criar conta grátis
                            </button>
                            <button
                                onClick={() => navigate("/auth/login")}
                                className="rounded-3xl border-2 border-white/40 px-7 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                            >
                                Já tenho conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingCTA;
