import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import AuthBackground from "@components/layout/AuthBackground";
import Button from "@components/ui/Button";

// Hero da landing: céu (sol + nuvens) sobre as ondas do AuthBackground, conteúdo centralizado
export const LandingHero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative flex min-h-[88vh] items-center overflow-hidden pb-24 pt-24 sm:pb-28 sm:pt-28">
            <AuthBackground variant="contained" sun />

            <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
                <h1 className="fade-up font-baskerville text-4xl font-bold leading-tight text-cloud-500 sm:text-5xl lg:text-6xl">
                    <span className="italic text-campfire-500 font-baskerville">Libras</span> ao alcance
                    <br />
                    de todos
                </h1>

                <p
                    className="fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-cloud-400 sm:text-lg"
                    style={{ animationDelay: "0.1s" }}
                >
                    Um repositório colaborativo de sinais que conecta intérpretes, alunos,
                    professores e familiares dentro da sala de aula.
                </p>

                <div
                    className="fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    style={{ animationDelay: "0.2s" }}
                >
                    <Button
                        icon={SignLanguageCIcon}
                        iconPosition="right"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/public-glossary")}
                    >
                        Explorar o repositório
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/auth/register")}
                    >
                        Solicitar entrada
                    </Button>
                </div>
            </div>

            {/* Indicador de scroll — canto inferior direito */}
            <a
                href="#para-quem"
                aria-label="Rolar para o conteúdo"
                className="bounce-down absolute bottom-8 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-colors duration-300 ease-out hover:bg-cloud-100 sm:right-10"
            >
                <HugeiconsIcon icon={ArrowDown01Icon} size={22} className="text-cloud-500" />
            </a>
        </section>
    );
};

export default LandingHero;
