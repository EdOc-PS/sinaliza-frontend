import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useAuth } from "@context/AuthContext";
import { getAvatarUrl } from "@lib/constants/avatars";
import { Tooltip } from "@components/ui/Tooltip";
import ConfirmModal from "@components/layout/ConfirmModal";

import {
    ChartIcon,
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

// `section: "admin"` separa os acessos de gestão dos acessos gerais no menu lateral
type MenuEntry = { icon: typeof Home06Icon; label: string; path: string; shortLabel?: string; section?: "admin" };

const menuItemsByRole: Record<string, MenuEntry[]> = {
    STUDENT: [
        { icon: LibrariesIcon, label: "Turmas", path: "/classrooms" },
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
    ],
    EDUCATOR: [
        { icon: LibrariesIcon, label: "Turmas", path: "/classrooms" },
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
        { icon: PencilIcon, label: "Ambiente de Trabalho", path: "/workspace", shortLabel: "Trabalho" },
    ],
    MANAGER: [
        { icon: LibrariesIcon, label: "Turmas", path: "/classrooms" },
        { icon: GlobalEducationIcon, label: "Glossário", path: "/glossary" },
        { icon: PencilIcon, label: "Ambiente de Trabalho", path: "/workspace", shortLabel: "Trabalho" },
        { icon: ChartIcon, label: "Dashboard", path: "/dashboard", section: "admin" },
        { icon: UserMultiple02Icon, label: "Educadores", path: "/educators", section: "admin" },
        { icon: StudentsIcon, label: "Alunos", path: "/members", section: "admin" },
    ],
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
        <Tooltip label={label} position="left">
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
    /** Substitui o ícone por uma imagem (ex: avatar do usuário no botão Perfil) */
    avatarUrl?: string;
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
    avatarUrl,
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
        <Tooltip label={label} position="left" bgColor={logout ? "bg-salmon-500" : "bg-cloud-700"}>
            <button
                onClick={handleClick}
                className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${sizeClass} ${avatarUrl ? "" : bgClass}`}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={label} className="h-full w-full object-cover" />
                ) : (
                    <span className={bouncing ? "icon-bounce" : ""}>
                        <HugeiconsIcon
                            icon={icon}
                            size={size}
                            className={`transition-colors duration-300 ${iconColor}`}
                        />
                    </span>
                )}
            </button>
        </Tooltip>
    );
};

const MenuNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [logoutModal, setLogoutModal] = useState(false);

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
    const mainItems = menuItems.filter((item) => item.section !== "admin");
    const adminItems = menuItems.filter((item) => item.section === "admin");

    const handleLogout = () => {
        setLogoutModal(false);
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
            {/* Mobile: menu horizontal inferior (< 992px) — perfil/favoritos/histórico ficam no MobileHeader.
                Agrupado como no desktop: acessos gerais separados dos administrativos (só gestor). */}
            <nav className="px-4 fixed bottom-0 left-0 right-0 lg:hidden bg-cloud-100 flex items-center justify-center gap-2 py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="bg-white rounded-2xl flex flex-1 max-w-md justify-around p-0.5">
                    {mainItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            shortLabel={item.shortLabel}
                            onClick={() => navigate(item.path)}
                            isDesktop={false}
                            isActive={isPathActive(item.path)}
                        />
                    ))}
                </div>

                {adminItems.length > 0 && (
                    <div className="bg-white rounded-2xl flex justify-around p-0.5">
                        {adminItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                shortLabel={item.shortLabel}
                                onClick={() => navigate(item.path)}
                                isDesktop={false}
                                isActive={isPathActive(item.path)}
                            />
                        ))}
                    </div>
                )}
            </nav>

            {/* Desktop: menu lateral esquerda (>= 992px) */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-20 bg-cloud-100 flex-col items-center pb-8 pt-4 gap-4 z-40">
                {/* Logo */}
                <img src="/logo/logo-simples.png" alt="Logo" className="w-12 h-12 mb-2" />
                {/* Acessos gerais */}
                <div className="bg-white rounded-2xl flex flex-col gap-2">
                    {mainItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => navigate(item.path)}
                            isDesktop={true}
                            isActive={isPathActive(item.path)}
                        />
                    ))}
                </div>

                {/* Acessos administrativos — só o gestor tem */}
                {adminItems.length > 0 && (
                    <div className="bg-white rounded-2xl flex flex-col gap-2">
                        {adminItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => navigate(item.path)}
                                isDesktop={true}
                                isActive={isPathActive(item.path)}
                            />
                        ))}
                    </div>
                )}

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
                        avatarUrl={getAvatarUrl(user?.avatar)}
                    />
                    <ActionItem
                        icon={Logout01Icon}
                        label="Sair"
                        onClick={() => setLogoutModal(true)}
                        logout
                    />
                </div>
            </aside>

            <ConfirmModal
                open={logoutModal}
                onClose={() => setLogoutModal(false)}
                onConfirm={handleLogout}
                icon={Logout01Icon}
                title="Sair da conta?"
                description="Você precisará entrar de novo para acessar a plataforma."
                confirmText="Sair"
            />
        </>
    );
};

export default MenuNavigation;
