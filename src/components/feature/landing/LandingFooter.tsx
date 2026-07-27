import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, MortarboardIcon } from "@hugeicons/core-free-icons";

import logo from "@/assets/images/logo/logo-simples.png";

const socials = [
    { icon: Github01Icon, label: "GitHub — EdOc-ps", href: "https://github.com/EdOc-ps" },
    { icon: MortarboardIcon, label: "IFMG — Campus Ouro Branco", href: "https://www.ifmg.edu.br/ourobranco" },
];

// Rodapé institucional — landing e repositório público
export const LandingFooter = () => (
    <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Marca */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-1.5">
                        <img src={logo} alt="" className="h-9 w-9" />
                        <span className="font-baskerville text-xl font-bold text-cloud-500">Sinaliza</span>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-cloud-400">
                        Repositório colaborativo de Libras para intérpretes, alunos, professores e familiares.
                    </p>
                    <div className="flex gap-2">
                        {socials.map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={label}
                                aria-label={label}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-cloud-100 text-cloud-400 transition-all duration-300 ease-out hover:bg-cloud-200 hover:text-cloud-600"
                            >
                                <HugeiconsIcon icon={icon} size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Plataforma */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cloud-500">Plataforma</h3>
                    <Link to="/public-glossary" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Repositório</Link>
                    <a href="/#como-funciona" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Como funciona</a>
                    <a href="/#recursos" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Recursos</a>
                    <a href="/#para-quem" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Para quem é</a>
                </div>

                {/* Conta */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cloud-500">Conta</h3>
                    <Link to="/auth/register" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Solicitar entrada</Link>
                    <Link to="/auth/login" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Entrar</Link>
                </div>

                {/* Projeto */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cloud-500">Projeto</h3>
                    <a href="/#sobre" className="text-sm text-cloud-400 transition-colors duration-300 ease-out hover:text-campfire-600">Sobre o TCC</a>
                    <span className="text-sm text-cloud-400">IFMG — Campus Ouro Branco</span>
                </div>
            </div>

            {/* Base */}
            <div className="mt-12 flex flex-col gap-2 border-t border-cloud-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-cloud-400">
                    © {new Date().getFullYear()} Sinaliza. Trabalho de Conclusão de Curso.
                </p>
                <p className="text-xs text-cloud-400">
                    Desenvolvido por <span className="font-semibold text-cloud-500">Eduardo Octavio</span>
                </p>
            </div>
        </div>
    </footer>
);

export default LandingFooter;
