import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "@components/ui/Button";
import logo from "@/assets/images/logo/logo-simples.png";

interface LandingHeaderProps {
    /** Âncoras da landing (não aparecem no repositório público) */
    showAnchors?: boolean;
    /**
     * Fundo do header. Na landing usa `bg-cloud-100` para emendar sem costura
     * com o topo azul do hero; no repositório público, branco.
     */
    background?: string;
}

const linkClass =
    "text-sm font-semibold text-cloud-500 transition-colors duration-300 ease-out hover:text-campfire-600";

// Header público — usado na landing e no repositório público
export const LandingHeader = ({ showAnchors = false, background = "bg-white" }: LandingHeaderProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Já estando no repositório, o link para ele não agrega
    const showRepositoryLink = pathname !== "/public-glossary";

    return (
        <header className={`relative z-50 ${background}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1.5 transition-opacity duration-300 ease-out hover:opacity-80">
                    <img src={logo} alt="" className="h-10 w-10" />
                    <span className="font-baskerville text-xl font-bold text-cloud-500">Sinaliza</span>
                </Link>

                {/* Navegação */}
                <nav className="hidden items-center gap-7 md:flex">
                    {showRepositoryLink && (
                        <Link to="/public-glossary" className={linkClass}>Repositório</Link>
                    )}
                    {showAnchors && (
                        <>
                            <a href="#como-funciona" className={linkClass}>Como funciona</a>
                            <a href="#recursos" className={linkClass}>Recursos</a>
                            <a href="#sobre" className={linkClass}>Sobre</a>
                        </>
                    )}
                </nav>

                {/* Ações */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/auth/login")} className={`hidden sm:block ${linkClass}`}>
                        Entrar
                    </button>
                    <Button size="sm" onClick={() => navigate("/auth/register")}>
                        Solicitar entrada
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;
