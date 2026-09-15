import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, UserGroupIcon, StudentsIcon} from "@hugeicons/core-free-icons";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { GetRequest, PatchRequest } from "@requests";
import { USERS } from "@routes/users";

import Input from "@components/ui/Input";
import Spinner from "@components/ui/Spinner";
import { ListCardMember, type MemberListItem } from "@components/feature/members/ListCardMember";
import { PendingApprovalCard } from "@components/feature/members/PendingApprovalCard";

const MembersPage = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const queryClient = useQueryClient();

    // Debounce da busca (350ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    // Papel e busca fazem parte da chave: alternar entre abas já visitadas
    // volta instantâneo, sem novo request.
    const { data: members = [], isPending: loading } = useQuery({
        queryKey: queryKeys.users.members("STUDENT", debouncedSearch),
        queryFn: () => {
            const params: Record<string, string> = { role: "STUDENT" };
            if (debouncedSearch) params.search = debouncedSearch;
            return unwrap(GetRequest<MemberListItem[]>(USERS.MEMBERS(), params));
        },
        meta: { errorMessage: "Falha ao carregar usuários" },
    });

    const { mutate: approvalMutate, variables: approvalVars, isPending: approving } = useMutation({
        mutationFn: ({ member, status }: { member: MemberListItem; status: "APPROVED" | "REJECTED" }) =>
            unwrap(PatchRequest(USERS.APPROVAL(member.id), { status })),
        onSuccess: (_data, { status }) => {
            toast.success(status === "APPROVED" ? "Conta aprovada!" : "Conta recusada.");
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        },
        onError: (err: Error) => toast.error("Falha ao atualizar: " + err.message),
    });

    // Qual linha está em processamento (para o spinner do botão)
    const processingId = approving ? approvalVars?.member.id ?? null : null;

    const handleApproval = (member: MemberListItem, status: "APPROVED" | "REJECTED") =>
        approvalMutate({ member, status });

    const pending = members.filter((m) => m.approvalStatus === "PENDING");
    const others = members.filter((m) => m.approvalStatus !== "PENDING");
    const roleLabel = "aluno";

    return (
        <section className="flex flex-col gap-8">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                        <HugeiconsIcon icon={StudentsIcon} size={26} className="text-sky-600" />
                    </div>
                    <div>
                        <h1 className="font-baskerville text-2xl font-bold text-cloud-600">Alunos</h1>
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
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-neutral-400">{others.length} aluno(s)</span>
                    </div>
                    <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2">
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
