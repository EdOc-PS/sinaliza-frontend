import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "@/assets/images/logo/logo-simples.png";

interface LandingHeaderProps {
    /** Âncoras da landing (não aparecem no repositório público) */
    showAnchors?: boolean;
    /** Fundo do header — na landing emenda com o topo do hero */
    background?: string;
}

const pillLink =
    "rounded-full px-4 py-2 text-sm font-semibold text-cloud-500 transition-colors duration-300 ease-out hover:bg-white hover:text-cloud-600";

// Header público — logo à esquerda, navegação agrupada numa pílula e CTA laranja
export const LandingHeader = ({ showAnchors = false, background = "bg-white" }: LandingHeaderProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Já estando no repositório, o link para ele não agrega
    const showRepositoryLink = pathname !== "/public-glossary";

    return (
        <header className={`relative z-50 ${background}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo + descritor */}
                <Link to="/" className="flex items-center gap-2 transition-opacity duration-300 ease-out hover:opacity-80">
                    <img src={logo} alt="" className="h-10 w-10" />
                    <span className="font-baskerville text-xl font-semibold text-cloud-600">Sinaliza</span>
                </Link>

                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Navegação em pílula */}
                    <nav className="mr-2 hidden items-center rounded-full bg-cloud-200/80 p-1.5 md:flex">
                        {showRepositoryLink && (
                            <Link to="/public-glossary" className={pillLink}>Repositório</Link>
                        )}
                        {showAnchors && (
                            <>
                                <a href="#como-funciona" className={pillLink}>Como funciona</a>
                                <a href="#recursos" className={pillLink}>Recursos</a>
                                <a href="#sobre" className={pillLink}>Sobre</a>
                            </>
                        )}
                    </nav>

                    {/* Ações de conta lado a lado */}
                    <Link
                        to="/auth/login"
                        className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-cloud-600 transition-colors duration-300 ease-out hover:bg-cloud-200 sm:px-5 sm:py-3"
                    >
                        Entrar
                    </Link>

                    <button
                        onClick={() => navigate("/auth/register")}
                        className="rounded-2xl bg-campfire-500 px-4 py-2.5 text-sm sm:px-5 sm:py-3 font-semibold text-cloud-700 transition-colors duration-300 ease-out hover:bg-campfire-600"
                    >
                        Solicitar entrada
                    </button>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;
