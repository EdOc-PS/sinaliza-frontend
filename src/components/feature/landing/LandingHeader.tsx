import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/images/logo/logo-simples.png";

interface LandingHeaderProps {
    /** Âncoras da landing (não aparecem no repositório público) */
    showAnchors?: boolean;
}

// Header público — usado na landing e no repositório público
export const LandingHeader = ({ showAnchors = false }: LandingHeaderProps) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1.5">
                    <img src={logo} alt="" className="h-10 w-10" />
                    <span className="font-baskerville text-xl font-bold text-cloud-500">sinaliza</span>
                </Link>

                {/* Navegação */}
                <nav className="hidden items-center gap-7 md:flex">
                    <Link to="/public-glossary" className="text-sm font-semibold text-cloud-500 transition-colors hover:text-campfire-600">
                        Repositório
                    </Link>
                    {showAnchors && (
                        <>
                            <a href="#como-funciona" className="text-sm font-semibold text-cloud-500 transition-colors hover:text-campfire-600">
                                Como funciona
                            </a>
                            <a href="#recursos" className="text-sm font-semibold text-cloud-500 transition-colors hover:text-campfire-600">
                                Recursos
                            </a>
                            <a href="#sobre" className="text-sm font-semibold text-cloud-500 transition-colors hover:text-campfire-600">
                                Sobre
                            </a>
                        </>
                    )}
                </nav>

                {/* Ações */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="hidden text-sm font-semibold text-cloud-500 transition-colors hover:text-campfire-600 sm:block"
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => navigate("/auth/register")}
                        className="rounded-2xl bg-cloud-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-cloud-600 hover:-translate-y-0.5"
                    >
                        Criar conta
                    </button>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;
