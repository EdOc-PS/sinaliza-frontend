import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import AuthBackground from "@components/layout/AuthBackground";
import WordReveal from "./WordReveal";

// Hero da landing: céu (sol + nuvens) sobre as ondas do AuthBackground.
export const LandingHero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative flex min-h-[92vh] items-center overflow-hidden pb-28 pt-20 sm:pb-32 sm:pt-24">
            <AuthBackground variant="contained" sun />

            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
                <h1 className="font-baskerville text-[2.6rem] font-normal leading-[1.1] tracking-tight text-cloud-600 sm:text-6xl lg:text-7xl">
                    <WordReveal
                        lines={[
                            [<em key="l" className="text-campfire-500">Libras</em>, "ao", "alcance"],
                            ["de", "toda", "a", "sala."],
                        ]}
                    />
                </h1>

                <p
                    className="fade-up mx-auto mt-7 max-w-lg text-base leading-relaxed text-cloud-500/80 sm:text-lg"
                    style={{ animationDelay: "0.55s" }}
                >
                    Sinais em vídeo, organizados por disciplina, feitos por quem
                    interpreta e ensina no IFMG.
                </p>

                <div
                    className="fade-up mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row"
                    style={{ animationDelay: "0.7s" }}
                >
                    <button
                        onClick={() => navigate("/public-glossary")}
                        className="flex items-center gap-2 rounded-full bg-cloud-600 px-6 py-3.5 text-sm font-semibold text-cloud-100 transition-colors duration-300 ease-out hover:bg-cloud-700"
                    >
                        Explorar o repositório
                        <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                    </button>
                    <Link
                        to="/auth/register"
                        className="group flex items-center gap-1 text-sm font-semibold text-cloud-500 transition-colors duration-300 ease-out hover:text-campfire-600"
                    >
                        Solicitar entrada
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>

            {/* Indicador de scroll — canto inferior direito */}
            <a
                href="#para-quem"
                aria-label="Rolar para o conteúdo"
                className="absolute bottom-0 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cloud-200 transition-colors duration-300 ease-out hover:bg-cloud-400/60 sm:right-10"
            >
                <HugeiconsIcon icon={ArrowDown01Icon} size={22} className="text-cloud-500" />
            </a>
        </section>
    );
};

export default LandingHero;
