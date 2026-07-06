import { HugeiconsIcon } from "@hugeicons/react";
import { DeleteIcon, Edit02Icon, Mail01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";

import { RoleBadge } from "@components/ui/RoleBadge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { getInitials } from "@lib/format/initials";
import type { EducatorType, Role } from "@api/requests";

export interface EducatorListItem {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    roles: Role[];
    educatorType?: EducatorType | null;
    createdAt: string;
}

interface ListCardEducatorProps {
    educator: EducatorListItem;
    onEdit: () => void;
    onDelete: () => void;
}

export const ListCardEducator = ({ educator, onEdit, onDelete }: ListCardEducatorProps) => (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-5 min-h-24">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-campfire-100 font-baskerville font-bold text-campfire-600">
            {educator.avatar ? (
                <img src={educator.avatar} alt={educator.name} className="h-full w-full object-cover" />
            ) : (
                getInitials(educator.name)
            )}
        </div>

        {/* Nome, email + badges de roles */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div>
                <span className="block truncate font-medium text-cloud-600">{educator.name}</span>
                <span className="flex items-center gap-1 truncate text-xs text-neutral-400">
                    <HugeiconsIcon icon={Mail01Icon} size={13} />
                    {educator.email}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
                {educator.roles.map((role) => (
                    <RoleBadge key={role} role={role} educatorType={educator.educatorType} />
                ))}
            </div>
        </div>

        {/* Ações */}
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-cloud-100 hover:text-cloud-600">
                    <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                    onSelect={onEdit}
                >
                    Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="danger"
                    icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                    onSelect={onDelete}
                >
                    Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export default ListCardEducator;
