import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    Knowledge01Icon,
    Knowledge02Icon,
    Settings02Icon,
} from "@hugeicons/core-free-icons";

export interface RoleBadgeUser {
    role: string;
    educatorType?: "TEACHER" | "INTERPRETER" | null;
}

interface RoleMeta {
    label: string;
    icon: IconSvgElement;
    className: string;
}

const ROLE_META: Record<string, RoleMeta> = {
    EDUCATOR:    { label: "Educador",   icon: Knowledge01Icon, className: "bg-campfire-100 text-campfire-700" },
    INTERPRETER: { label: "Intérprete", icon: Knowledge01Icon, className: "bg-campfire-100 text-campfire-700" },
    STUDENT:     { label: "Aluno",      icon: Knowledge02Icon, className: "bg-sky-100 text-sky-700" },
    GUARDIAN:    { label: "Familiar",   icon: Knowledge02Icon, className: "bg-sky-100 text-sky-700" },
    ADMIN:       { label: "Admin",      icon: Settings02Icon,  className: "bg-lime-100 text-lime-700" },
};

// Educador/intérprete são a mesma role (EDUCATOR); o tipo vem de user.educatorType
export const getRoleMeta = (user: RoleBadgeUser): RoleMeta => {
    if (user.role === "EDUCATOR" && user.educatorType === "INTERPRETER") {
        return ROLE_META.INTERPRETER;
    }
    return ROLE_META[user.role] ?? { label: user.role, icon: Knowledge02Icon, className: "bg-cloud-100 text-cloud-500" };
};

interface RoleBadgeProps {
    user: RoleBadgeUser;
    className?: string;
}

export const RoleBadge = ({ user, className = "" }: RoleBadgeProps) => {
    const role = getRoleMeta(user);

    return (
        <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${role.className} ${className}`}>
            <HugeiconsIcon icon={role.icon} size={13} />
            {role.label}
        </span>
    );
};
