import { FavouriteIcon, HelpCircleIcon, Search01Icon, Time01Icon, User03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate, useLocation } from "react-router-dom";

interface MobileHeaderProps {
    searchOpen?: boolean;
    onToggleSearch?: () => void;
    onOpenHelp?: () => void;
}

const MobileHeader = ({ searchOpen = false, onToggleSearch, onOpenHelp }: MobileHeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const iconClass = (path: string) =>
        `flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isActive(path) ? "bg-lime-100 text-lime-700" : "text-cloud-500 hover:bg-cloud-200"
        }`;

    return (
        <header className="lg:hidden bg-cloud-100 p-4 flex items-center justify-between">
            {/* Logo */}
            <img src="/logo/logo-simples.png" alt="Logo" className="w-10 h-10" />

            {/* Buscar + Ajuda · Favoritos + Histórico (agrupados) · Perfil (separado, maior) */}
            <div className="flex items-center gap-2">
                <div className="flex items-center rounded-2xl bg-white p-0.5">
                    <button
                        onClick={onToggleSearch}
                        aria-label="Buscar sinal"
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${searchOpen ? "bg-lime-100 text-lime-700" : "text-cloud-500 hover:bg-cloud-200"}`}
                    >
                        <HugeiconsIcon icon={Search01Icon} size={20} />
                    </button>
                    <button onClick={onOpenHelp} aria-label="Ajuda: como usar a plataforma" className="flex items-center justify-center w-10 h-10 rounded-xl text-cloud-500 transition-colors hover:bg-cloud-200">
                        <HugeiconsIcon icon={HelpCircleIcon} size={20} />
                    </button>
                    <button onClick={() => navigate("/favorites")} className={iconClass("/favorites")}>
                        <HugeiconsIcon icon={FavouriteIcon} size={20} />
                    </button>
                    <button onClick={() => navigate("/history")} className={iconClass("/history")}>
                        <HugeiconsIcon icon={Time01Icon} size={20} />
                    </button>
                </div>

                <button
                    onClick={() => navigate("/profile")}
                    className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-colors ${isActive("/profile") ? "bg-lime-100 text-lime-700" : "bg-white text-cloud-500 hover:bg-cloud-200"
                        }`}
                >
                    <HugeiconsIcon icon={User03Icon} size={24} />
                </button>
            </div>
        </header>
    );
};

export default MobileHeader;
