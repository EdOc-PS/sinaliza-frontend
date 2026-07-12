import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { RoleBadge } from "@/components/ui/RoleBadge";

export interface Member {
    roleInClass: string;
    createdAt: string;
    user: { id: string; name: string; avatar?: string; role: string; educatorType?: "TEACHER" | "INTERPRETER" | null };
}

interface MemberSectionProps {
    title: string;
    members: Member[];
    /** Quando definido, mostra um botão de remover em cada participante (exceto os bloqueados) */
    onRemove?: (member: Member) => void;
    /** IDs de usuários que não podem ser removidos (ex: professor da disciplina) */
    lockedUserIds?: string[];
}

export const MemberSection = ({ title, members, onRemove, lockedUserIds = [] }: MemberSectionProps) => (
    <div className="flex flex-col gap-3">
        <div className="px-1">
            <h3 className="font-baskerville text-lg text-cloud-600">{title}</h3>
        </div>

        <div className="bg-white rounded-3xl px-2 py-2">
            {members.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <HugeiconsIcon icon={UserGroupIcon} size={36} className="text-cloud-200" />
                    <p className="text-sm text-neutral-400">Nenhum participante nesta seção.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {members.map((m) => (
                        <div
                            key={m.user.id}
                            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-cloud-100/60 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud-300 text-sm font-semibold text-white overflow-hidden">
                                {m.user.avatar ? (
                                    <img src={m.user.avatar} alt={m.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    m.user.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Nome */}
                            <span className="flex-1 text-sm font-medium text-cloud-600">{m.user.name}</span>

                            {/* Role badge */}
                            <RoleBadge role={m.roleInClass} educatorType={m.user.educatorType} />

                            {/* Remover (apenas educador, exceto usuários bloqueados) */}
                            {onRemove && !lockedUserIds.includes(m.user.id) && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(m)}
                                    title="Remover da disciplina"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-salmon-100 hover:text-salmon-600"
                                >
                                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
