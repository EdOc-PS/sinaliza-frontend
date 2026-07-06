import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    Knowledge01Icon,
    Knowledge02Icon,
    UserMultiple02Icon,
} from "@hugeicons/core-free-icons";

interface RoleMeta {
    label: string;
    icon: IconSvgElement;
    className: string;
}

const ROLE_META: Record<string, RoleMeta> = {
    PROFESSOR:   { label: "Professor",  icon: Knowledge01Icon, className: "bg-salmon-100 text-salmon-700" },
    INTERPRETER: { label: "Intérprete", icon: Knowledge01Icon, className: "bg-campfire-100 text-campfire-700" },
    STUDENT:     { label: "Aluno",      icon: Knowledge02Icon, className: "bg-sky-100 text-sky-700" },
    GUARDIAN:    { label: "Familiar",   icon: Knowledge02Icon, className: "bg-sky-100 text-sky-700" },
    FAMILY:      { label: "Familiar",   icon: Knowledge02Icon, className: "bg-sky-100 text-sky-700" },
    ASSISTANT:   { label: "Assistente", icon: Knowledge02Icon, className: "bg-cloud-100 text-cloud-600" },
    MANAGER:     { label: "Gestor",     icon: UserMultiple02Icon, className: "bg-lime-100 text-lime-700" },
};

// A role EDUCATOR não vira um badge "Educador": vira Professor ou Intérprete,
// conforme o educatorType (TEACHER → Professor, INTERPRETER → Intérprete).
export const getRoleMeta = (role: string, educatorType?: "TEACHER" | "INTERPRETER" | null): RoleMeta => {
    if (role === "EDUCATOR") {
        return educatorType === "INTERPRETER" ? ROLE_META.INTERPRETER : ROLE_META.PROFESSOR;
    }
    return ROLE_META[role] ?? { label: role, icon: Knowledge02Icon, className: "bg-cloud-100 text-cloud-500" };
};

interface RoleBadgeProps {
    role: string;
    educatorType?: "TEACHER" | "INTERPRETER" | null;
    className?: string;
}

export const RoleBadge = ({ role, educatorType, className = "" }: RoleBadgeProps) => {
    const meta = getRoleMeta(role, educatorType);

    return (
        <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${meta.className} ${className}`}>
            <HugeiconsIcon icon={meta.icon} size={13} />
            {meta.label}
        </span>
    );
};
