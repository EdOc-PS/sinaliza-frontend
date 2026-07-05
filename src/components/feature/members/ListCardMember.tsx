import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";

import { RoleBadge } from "@components/ui/RoleBadge";
import type { ApprovalStatus, EducatorType, Role } from "@api/requests";

export interface MemberListItem {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    roles: Role[];
    educatorType?: EducatorType | null;
    approvalStatus?: ApprovalStatus | null;
    createdAt: string;
}

const STATUS_META: Record<ApprovalStatus, { label: string; className: string }> = {
    PENDING:  { label: "Pendente", className: "bg-sunflower-100 text-sunflower-700" },
    APPROVED: { label: "Aprovado", className: "bg-lime-100 text-lime-700" },
    REJECTED: { label: "Recusado", className: "bg-salmon-100 text-salmon-700" },
};

const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

interface ListCardMemberProps {
    member: MemberListItem;
}

export const ListCardMember = ({ member }: ListCardMemberProps) => {
    const status = member.approvalStatus ? STATUS_META[member.approvalStatus] : null;

    return (
        <div className="flex items-center gap-3 rounded-3xl bg-white p-5 min-h-24">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 font-baskerville font-bold text-sky-600">
                {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                    initials(member.name)
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
                </div>
            </div>
        </div>
    );
};

export default ListCardMember;
