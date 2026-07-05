import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, StudentsIcon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { GetRequest, PatchRequest } from "@requests";
import { USERS } from "@routes/users";
import type { Role } from "@api/requests";

import Input from "@components/ui/Input";
import Select from "@components/ui/Select";
import Spinner from "@components/ui/Spinner";
import { ListCardMember, type MemberListItem } from "@components/feature/members/ListCardMember";
import { PendingApprovalCard } from "@components/feature/members/PendingApprovalCard";

const ROLE_OPTIONS = [
    { label: "Alunos", value: "STUDENT" },
    { label: "Responsáveis", value: "GUARDIAN" },
];

const MembersPage = () => {
    const [role, setRole] = useState<Role>("STUDENT");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<MemberListItem[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Debounce da busca (350ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const loadMembers = useCallback(async (currentRole: Role, query?: string) => {
        setLoading(true);
        try {
            const params: Record<string, string> = { role: currentRole };
            if (query) params.search = query;
            const res = await GetRequest<MemberListItem[]>(USERS.MEMBERS(), params);
            if (!res.success) { toast.error("Falha ao carregar usuários: " + res.message); return; }
            setMembers(res.object ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMembers(role, debouncedSearch || undefined);
    }, [loadMembers, role, debouncedSearch]);

    const handleApproval = async (member: MemberListItem, status: "APPROVED" | "REJECTED") => {
        setProcessingId(member.id);
        try {
            const res = await PatchRequest(USERS.APPROVAL(member.id), { status });
            if (!res.success) { toast.error("Falha ao atualizar: " + res.message); return; }
            toast.success(status === "APPROVED" ? "Conta aprovada!" : "Conta recusada.");
            loadMembers(role, debouncedSearch || undefined);
        } finally {
            setProcessingId(null);
        }
    };

    const pending = members.filter((m) => m.approvalStatus === "PENDING");
    const others = members.filter((m) => m.approvalStatus !== "PENDING");
    const roleLabel = role === "STUDENT" ? "aluno" : "responsável";

    return (
        <section className="flex flex-col gap-8">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                        <HugeiconsIcon icon={UserGroupIcon} size={26} className="text-sky-600" />
                    </div>
                    <div>
                        <h1 className="font-baskerville text-2xl font-bold text-cloud-600">Alunos e responsáveis</h1>
                        <p className="text-sm text-neutral-500">Acompanhe e aprove as contas da instituição</p>
                    </div>
                </div>

                {/* Busca + tipo */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <Input
                            icon={Search01Icon}
                            value={search}
                            onChange={setSearch}
                            placeholder="Buscar por nome ou email..."
                        />
                    </div>
                    <div className="sm:w-52">
                        <Select
                            icon={StudentsIcon}
                            options={ROLE_OPTIONS}
                            value={role}
                            onChange={(v) => setRole(v as Role)}
                        />
                    </div>
                </div>
            </div>

            {/* Card de aprovações pendentes */}
            {!loading && (
                <PendingApprovalCard
                    pending={pending}
                    processingId={processingId}
                    onApprove={(m) => handleApproval(m, "APPROVED")}
                    onReject={(m) => handleApproval(m, "REJECTED")}
                />
            )}

            {/* Lista */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={32} color="#6B7280" />
                </div>
            ) : others.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                    <HugeiconsIcon icon={UserGroupIcon} size={40} className="text-cloud-300" />
                    <div>
                        <p className="text-sm font-medium text-cloud-500">
                            {debouncedSearch ? "Nenhum resultado encontrado" : `Nenhum ${roleLabel} por aqui`}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                            {debouncedSearch ? `Nada corresponde a "${debouncedSearch}".` : "As contas aprovadas aparecerão nesta lista."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <span className="text-xs text-neutral-400">{others.length} {role === "STUDENT" ? "aluno(s)" : "responsável(is)"}</span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {others.map((member) => (
                            <ListCardMember key={member.id} member={member} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default MembersPage;
