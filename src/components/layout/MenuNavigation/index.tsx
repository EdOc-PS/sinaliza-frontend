import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useAuth } from "@context/AuthContext";

import {
    FavouriteIcon,
    GlobalEducationIcon,
    Time01Icon,
    Home06Icon,
    LibrariesIcon,
    Logout01Icon,
    PencilIcon,
    StudentsIcon,
    UserMultiple02Icon,
    User03Icon
} from "@hugeicons/core-free-icons";

interface MenuItemProps {
    icon: typeof Home06Icon;
    label: string;
    shortLabel?: string;
    onClick?: () => void;
    isDesktop?: boolean;
    isActive?: boolean;
}

interface TooltipProps {
    label: string;
    isDesktop?: boolean;
    children: ReactNode;
    bgColor?: string;
}

type MenuEntry = { icon: typeof Home06Icon; label: string; path: string; shortLabel?: string };

const menuItemsByRole: Record<string, MenuEntry[]> = {
    STUDENT: [
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
        { icon: LibrariesIcon, label: "Disciplinas", path: "/classrooms" }
    ],
    EDUCATOR: [
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
        { icon: LibrariesIcon, label: "Disciplinas", path: "/classrooms" },
        { icon: PencilIcon, label: "Ambiente de Trabalho", path: "/workspace", shortLabel: "Trabalho" }
    ],
    GUARDIAN: [
        { icon: LibrariesIcon, label: "Disciplinas", path: "/classrooms" }
    ],
    MANAGER: [
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
        { icon: LibrariesIcon, label: "Disciplinas", path: "/classrooms" },
        { icon: PencilIcon, label: "Ambiente de Trabalho", path: "/workspace", shortLabel: "Trabalho" },
        { icon: UserMultiple02Icon, label: "Educadores", path: "/educators" },
        { icon: StudentsIcon, label: "Alunos e responsáveis", path: "/members", shortLabel: "Alunos" }
    ]
};

// Componente de Tooltip para hover do mouse
const Tooltip = ({ label, isDesktop = false, children, bgColor = "bg-cloud-700" }: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const colorMap: Record<string, string> = {
        "bg-cloud-700": "#132433",
        "bg-salmon-500": "#EEA2A2",
    };

    const arrowFill = colorMap[bgColor] || "#132433";

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {isHovered && (
                <div
                    className={`
                        absolute z-50 text-white px-3 py-2 rounded-full text-sm font-medium
                        whitespace-nowrap shadow-lg pointer-events-none
                        ${bgColor}
                        ${isDesktop ? "left-full ml-3 top-1/2 -translate-y-1/2" : "bottom-full mb-2 left-1/2 -translate-x-1/2"}
                    `}
                >
                    {label}

                    {isDesktop ? (
                        <svg className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 8 2 Q 4 5 8 8 L 2 5 Z" />
                        </svg>
                    ) : (
                        <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 2 2 Q 5 4 8 2 L 5 8 Z" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    );
};

// Componente de MenuItem que recebe ícone, label e função de clique
const MenuItem = ({ icon, label, shortLabel, onClick, isDesktop = false, isActive = false }: MenuItemProps) => {
    const [bouncing, setBouncing] = useState(false);

    const handleClick = () => {
        setBouncing(true);
        setTimeout(() => setBouncing(false), 450);
        onClick?.();
    };

    // Mobile: ícone + label desliza abaixo quando ativo
    if (!isDesktop) {
        return (
            <button
                onClick={handleClick}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-0 focus:outline-none"
            >
                <span className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${isActive ? "bg-lime-100" : ""}`}>
                    <span className={bouncing ? "icon-bounce" : ""}>
                        <HugeiconsIcon
                            icon={icon}
                            size={22}
                            className={`transition-colors duration-300 ${isActive ? "text-lime-700" : "text-cloud-500"}`}
                        />
                    </span>
                </span>
                <span
                    className={`text-[10px] font-bold leading-none whitespace-nowrap transition-all duration-300 overflow-hidden ${isActive ? "max-h-4 opacity-100 text-lime-600" : "max-h-0 opacity-0 text-transparent"
                        }`}
                >
                    {shortLabel ?? label}
                </span>
            </button>
        );
    }

    // Desktop: Tooltip + bounce no clique + transição suave do fundo
    return (
        <Tooltip label={label} isDesktop={true}>
            <button
                onClick={handleClick}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isActive ? "bg-lime-100/80" : "hover:bg-cloud-200"
                    }`}
            >
                <span className={bouncing ? "icon-bounce" : ""}>
                    <HugeiconsIcon
                        icon={icon}
                        size={24}
                        className={`transition-colors duration-300 ${isActive ? "text-lime-700" : "text-cloud-500"}`}
                    />
                </span>
            </button>
        </Tooltip>
    );
};

interface ActionItemProps {
    icon: typeof Home06Icon;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    size?: number;
    sizeClass?: string;
    idleBg?: string;
    logout?: boolean;
}

// Botões da seção inferior (Favoritos, Histórico, Perfil, Sair) com bounce no clique e verde ativo
const ActionItem = ({
    icon,
    label,
    onClick,
    isActive = false,
    size = 24,
    sizeClass = "w-12 h-12 rounded-2xl",
    idleBg = "bg-white hover:bg-cloud-200",
    logout = false,
}: ActionItemProps) => {
    const [bouncing, setBouncing] = useState(false);

    const handleClick = () => {
        setBouncing(true);
        setTimeout(() => setBouncing(false), 450);
        onClick?.();
    };

    // No "Sair" aplicamos só a animação (mantém o salmon, sem verde ativo)
    const bgClass = logout
        ? "bg-salmon-100 hover:bg-salmon-200"
        : isActive
            ? "bg-lime-100/80"
            : idleBg;

    const iconColor = logout
        ? "text-salmon-400"
        : isActive
            ? "text-lime-700"
            : "text-cloud-500";

    return (
        <Tooltip label={label} isDesktop={true} bgColor={logout ? "bg-salmon-500" : "bg-cloud-700"}>
            <button
                onClick={handleClick}
                className={`flex items-center justify-center transition-all duration-300 ${sizeClass} ${bgClass}`}
            >
                <span className={bouncing ? "icon-bounce" : ""}>
                    <HugeiconsIcon
                        icon={icon}
                        size={size}
                        className={`transition-colors duration-300 ${iconColor}`}
                    />
                </span>
            </button>
        </Tooltip>
    );
};

const MenuNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Seleciona os itens de menu baseado na role do usuário
    // Usuário pode ter várias roles — mescla os itens de menu de todas (sem duplicar por path)
    const roles = user?.roles?.length ? user.roles : ["STUDENT"];
    const menuItems = Array.from(
        new Map(
            roles
                .flatMap((r) => menuItemsByRole[r] ?? [])
                .map((item) => [item.path, item]),
        ).values(),
    );

    const handleLogout = () => {
        toast.success("Até logo!");
        logout();
        // PrivateRoute detecta user=null e redireciona automaticamente
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const isPathActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Mobile: menu horizontal inferior (< 992px) — perfil/favoritos/histórico ficam no MobileHeader */}
            <nav className="px-4 fixed bottom-0 left-0 right-0 lg:hidden bg-cloud-100 flex items-center justify-center py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="bg-white rounded-2xl flex w-full max-w-md justify-around p-0.5">
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            shortLabel={item.shortLabel}
                            onClick={() => navigate(item.path)}
                            isDesktop={false}
                            isActive={isPathActive(item.path)}
                        />
                    ))}
                </div>
            </nav>

            {/* Desktop: menu lateral esquerda (>= 992px) */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-20 bg-cloud-100 flex-col items-center pb-8 pt-4 gap-4 z-40">
                {/* Logo */}
                <img src="/logo/logo-simples.png" alt="Logo" className="w-12 h-12 mb-2" />
                {/* Menu Items */}
                <div className="bg-white rounded-2xl flex flex-col gap-2">
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => navigate(item.path)}
                            isDesktop={true}
                            isActive={isPathActive(item.path)}
                        />
                    ))}
                </div>

                {/* Perfil */}
                <div className="flex flex-col items-center gap-4 mt-auto">
                    <div className="flex flex-col items-center rounded-xl bg-white">
                        <ActionItem
                            icon={FavouriteIcon}
                            label="Favoritos"
                            size={20}
                            sizeClass="w-10 h-10 rounded-xl"
                            idleBg="hover:bg-cloud-200"
                            onClick={() => navigate("/favorites")}
                            isActive={isPathActive("/favorites")}
                        />

                        <ActionItem
                            icon={Time01Icon}
                            label="Histórico"
                            size={20}
                            sizeClass="w-10 h-10 rounded-xl"
                            idleBg="hover:bg-cloud-200"
                            onClick={() => navigate("/history")}
                            isActive={isPathActive("/history")}
                        />
                    </div>

                    <ActionItem
                        icon={User03Icon}
                        label="Perfil"
                        onClick={handleProfileClick}
                        isActive={isPathActive("/profile")}
                    />
                    <ActionItem
                        icon={Logout01Icon}
                        label="Sair"
                        onClick={handleLogout}
                        logout
                    />
                </div>
            </aside>
        </>
    );
};

export default MenuNavigation;
