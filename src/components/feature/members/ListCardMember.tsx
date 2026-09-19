import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, MoreVerticalIcon, UserBlock01Icon, UserCheck01Icon } from "@hugeicons/core-free-icons";

import { RoleBadge } from "@components/ui/RoleBadge";
import Spinner from "@components/ui/Spinner";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@components/ui/DropdownMenu";
import { getInitials } from "@lib/format/initials";
import { getAvatarUrl } from "@lib/constants/avatars";
import type { ApprovalStatus, EducatorType, Role } from "@api/requests";

export interface MemberListItem {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    roles: Role[];
    educatorType?: EducatorType | null;
    approvalStatus?: ApprovalStatus | null;
    /** Conta ativa — desativada não consegue mais logar */
    status: boolean;
    createdAt: string;
}

const STATUS_META: Record<ApprovalStatus, { label: string; className: string }> = {
    PENDING:  { label: "Pendente", className: "bg-sunflower-100 text-sunflower-700" },
    APPROVED: { label: "Aprovado", className: "bg-lime-100 text-lime-700" },
    REJECTED: { label: "Recusado", className: "bg-salmon-100 text-salmon-700" },
};

interface ListCardMemberProps {
    member: MemberListItem;
    /** Ausente = card sem ação de gerenciar (ex: tela sem gestor) */
    onToggleStatus?: (member: MemberListItem) => void;
    updatingStatus?: boolean;
}

export const ListCardMember = ({ member, onToggleStatus, updatingStatus = false }: ListCardMemberProps) => {
    const status = member.approvalStatus ? STATUS_META[member.approvalStatus] : null;

    return (
        <div className={`flex items-center gap-3 rounded-3xl bg-white p-5 min-h-24 ${!member.status ? "opacity-60" : ""}`}>
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 font-baskerville font-bold text-sky-600">
                {getAvatarUrl(member.avatar) ? (
                    <img src={getAvatarUrl(member.avatar)} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                    getInitials(member.name)
                )}
            </div>

            {/* Nome, email + badges */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div>
                    <span className="block truncate font-medium text-cloud-600">{member.name}</span>
                    <span className="flex items-center gap-1 truncate text-xs text-neutral-400">
                        <HugeiconsIcon icon={Mail01Icon} size={13} />
                        {member.email}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {member.roles.map((role) => (
                        <RoleBadge key={role} role={role} educatorType={member.educatorType} />
                    ))}
                    {status && (
                        <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                    )}
                    {!member.status && (
                        <span className="flex items-center gap-1 rounded-lg bg-neutral-200 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                            Desativado
                        </span>
                    )}
                </div>
            </div>

            {/* Ativar/desativar — só quando o pai passa a ação (tela do gestor) */}
            {onToggleStatus && (
                <div onClick={(e) => e.stopPropagation()}>
                    {updatingStatus ? (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                            <Spinner size={18} color="#6B7280" />
                        </div>
                    ) : (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-cloud-100 hover:text-cloud-600">
                                    <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {member.status ? (
                                    <DropdownMenuItem
                                        variant="danger"
                                        icon={<HugeiconsIcon icon={UserBlock01Icon} size={18} />}
                                        onSelect={() => onToggleStatus(member)}
                                    >
                                        Desativar conta
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        icon={<HugeiconsIcon icon={UserCheck01Icon} size={18} />}
                                        onSelect={() => onToggleStatus(member)}
                                    >
                                        Reativar conta
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListCardMember;
