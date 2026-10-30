import { Link } from "react-router-dom";

import logo from "@/assets/images/logo/logo-simples.png";

interface FooterLink {
    label: string;
    to: string;
    external?: boolean;
}

const columns: { title: string; links: FooterLink[] }[] = [
    {
        title: "Plataforma",
        links: [
            { label: "Repositório", to: "/public-glossary" },
            { label: "Como funciona", to: "/#como-funciona" },
            { label: "Recursos", to: "/#recursos" },
            { label: "Para quem é", to: "/#para-quem" },
        ],
    },
    {
        title: "Conta",
        links: [
            { label: "Solicitar entrada", to: "/auth/register" },
            { label: "Entrar", to: "/auth/login" },
            { label: "Esqueci a senha", to: "/auth/forgot-password" },
        ],
    },
    {
        title: "Projeto",
        links: [
            { label: "Sobre o TCC", to: "/#sobre" },
            { label: "IFMG Ouro Branco", to: "https://www.ifmg.edu.br/ourobranco", external: true },
            { label: "GitHub", to: "https://github.com/EdOc-ps", external: true },
        ],
    },
];

const linkClass = "text-sm text-cloud-500 transition-colors duration-300 ease-out hover:text-campfire-600";

function FooterAnchor({ label, to, external }: FooterLink) {
    if (external) {
        return <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}</a>;
    }
    if (to.includes("#")) {
        return <a href={to} className={linkClass}>{label}</a>;
    }
    return <Link to={to} className={linkClass}>{label}</Link>;
}

// Rodapé público — colunas de links, wordmark gigante sumindo e linha de base
export const LandingFooter = () => (
    <footer className="overflow-hidden bg-cloud-100">
        <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
                {/* Marca */}
                <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
                    <div className="flex items-center gap-1.5">
                        <img src={logo} alt="" className="h-8 w-8" />
                        <span className="font-baskerville text-lg font-bold text-cloud-600">Sinaliza</span>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-cloud-500/75">
                        Repositório de sinais em Libras para intérpretes, alunos e professores do IFMG.
                    </p>
                    <span className="flex items-center gap-2 text-xs text-cloud-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                        Repositório público no ar
                    </span>
                </div>

                {columns.map((col) => (
                    <div key={col.title} className="flex flex-col gap-3.5">
                        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cloud-400">
                            {col.title}
                        </h3>
                        {col.links.map((link) => (
                            <FooterAnchor key={link.label} {...link} />
                        ))}
                    </div>
                ))}
            </div>
        </div>

        {/* Wordmark gigante — sai do fluxo das colunas e some em degradê */}
        <div aria-hidden className="mx-auto mt-16 max-w-7xl select-none px-2 sm:mt-20">
            <p className="footer-wordmark text-center font-baskerville text-[22vw] leading-[0.8] tracking-tight xl:text-[17rem]">
                Sinaliza
            </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 border-t border-cloud-300/70 py-6 text-xs text-cloud-400 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} Sinaliza · Feito por Eduardo Octavio no IFMG</p>
                <div className="flex gap-5">
                    <Link to="/public-glossary" className="transition-colors duration-300 ease-out hover:text-cloud-600">Repositório</Link>
                    <a href="/#sobre" className="transition-colors duration-300 ease-out hover:text-cloud-600">Sobre</a>
                    <Link to="/auth/login" className="transition-colors duration-300 ease-out hover:text-cloud-600">Entrar</Link>
                </div>
            </div>
        </div>
    </footer>
);

export default LandingFooter;
