import { HugeiconsIcon } from "@hugeicons/react";
import { Tick04Icon, Cancel02Icon, Mail01Icon, UserTime03Icon } from "@hugeicons/core-free-icons";

import { RoleBadge } from "@components/ui/RoleBadge";
import { getInitials } from "@lib/format/initials";
import type { MemberListItem } from "./ListCardMember";

interface PendingApprovalCardProps {
    pending: MemberListItem[];
    processingId: string | null;
    onApprove: (member: MemberListItem) => void;
    onReject: (member: MemberListItem) => void;
}

export const PendingApprovalCard = ({ pending, processingId, onApprove, onReject }: PendingApprovalCardProps) => {
    if (pending.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 rounded-3xl bg-sunflower-100 p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sunflower-200">
                    <HugeiconsIcon icon={UserTime03Icon} size={24} className="text-sunflower-700" />
                </div>
                <div>
                    <h2 className="font-baskerville text-lg font-bold text-cloud-600">Aprovações pendentes</h2>
                    <p className="text-sm text-cloud-500">
                        {pending.length} conta{pending.length > 1 ? "s" : ""} aguardando sua aprovação
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {pending.map((member) => {
                    const busy = processingId === member.id;
                    return (
                        <div key={member.id} className="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row sm:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-100 font-baskerville text-sm font-bold text-sky-600">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                                    ) : (
                                        getInitials(member.name)
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="truncate font-medium text-cloud-600">{member.name}</span>
                                        {member.roles.map((role) => (
                                            <RoleBadge key={role} role={role} educatorType={member.educatorType} />
                                        ))}
                                    </div>
                                    <span className="flex items-center gap-1 truncate text-xs text-neutral-400">
                                        <HugeiconsIcon icon={Mail01Icon} size={13} />
                                        {member.email}
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => onReject(member)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-salmon-100 px-3 py-2 text-sm font-medium text-salmon-600 transition-colors hover:bg-salmon-200 disabled:opacity-50 sm:flex-none"
                                >
                                    <HugeiconsIcon icon={Cancel02Icon} size={22} />
                                    Recusar
                                </button>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => onApprove(member)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-lime-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-600 disabled:opacity-50 sm:flex-none"
                                >
                                    <HugeiconsIcon icon={Tick04Icon} size={22}/>
                                    Aprovar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PendingApprovalCard;
