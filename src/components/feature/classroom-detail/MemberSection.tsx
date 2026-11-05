import { Tooltip } from "@components/ui/Tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, StarAward01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { getAvatarUrl } from "@lib/constants/avatars";

export interface Member {
    roleInClass: string;
    isAdmin?: boolean;
    createdAt: string;
    user: { id: string; name: string; avatar?: string; role: string; educatorType?: "TEACHER" | "INTERPRETER" | null };
}

interface MemberSectionProps {
    title: string;
    members: Member[];
    /** Quando definido, mostra um botão de remover em cada participante (exceto os bloqueados) */
    onRemove?: (member: Member) => void;
    /** IDs de usuários que não podem ser removidos (ex: professor da turma) */
    lockedUserIds?: string[];
    /** Dono da turma: recebe a tag "Dono" */
    ownerId?: string;
    /** Quando definido, educadores ganham o botão de promover/rebaixar */
    onToggleAdmin?: (member: Member) => void;
}

export const MemberSection = ({ title, members, onRemove, lockedUserIds = [], ownerId, onToggleAdmin }: MemberSectionProps) => (
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
                <div className="stagger-children flex flex-col gap-1">
                    {members.map((m) => (
                        <div
                            key={m.user.id}
                            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-cloud-100/60 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud-300 text-sm font-semibold text-white overflow-hidden">
                                {getAvatarUrl(m.user.avatar) ? (
                                    <img src={getAvatarUrl(m.user.avatar)} alt={m.user.name} className="h-full w-full object-cover" />
                                ) : (
                                    m.user.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Nome */}
                            <span className="flex-1 text-sm font-medium text-cloud-600">{m.user.name}</span>

                            {/* Papel dentro da turma */}
                            {(m.user.id === ownerId || m.isAdmin) && (
                                <span className="rounded-lg bg-sunflower-100 px-2 py-0.5 text-xs font-semibold text-sunflower-700">
                                    {m.user.id === ownerId ? "Dono" : "Admin"}
                                </span>
                            )}

                            {/* Role badge */}
                            <RoleBadge role={m.roleInClass} educatorType={m.user.educatorType} />

                            {/* Promover/rebaixar (apenas educadores matriculados) */}
                            {onToggleAdmin && m.roleInClass === "EDUCATOR" && !lockedUserIds.includes(m.user.id) && (
                                <Tooltip label={m.isAdmin ? "Remover administrador" : "Tornar administrador"} position="top">
                                    <button
                                        type="button"
                                        onClick={() => onToggleAdmin(m)}
                                        aria-label={m.isAdmin ? "Remover administrador" : "Tornar administrador"}
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${m.isAdmin ? "bg-sunflower-100 text-sunflower-700" : "text-cloud-400 hover:bg-sunflower-100 hover:text-sunflower-700"}`}
                                    >
                                        <HugeiconsIcon icon={StarAward01Icon} size={18} />
                                    </button>
                                </Tooltip>
                            )}

                            {/* Remover (apenas educador, exceto usuários bloqueados) */}
                            {onRemove && !lockedUserIds.includes(m.user.id) && (
                                <Tooltip label="Remover da turma" position="top">
                                    <button
                                        type="button"
                                        onClick={() => onRemove(m)}
                                        aria-label="Remover da turma"
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-salmon-100 hover:text-salmon-600"
                                    >
                                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
