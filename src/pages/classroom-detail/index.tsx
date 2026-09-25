import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { DeleteRequest, GetRequest, PatchRequest } from "@requests";
import { CLASSROOMS } from "@routes/classrooms";
import { SIGNS } from "@routes/signs";
import { useAuth } from "@context/AuthContext";

import Spinner from "@components/ui/Spinner";
import Modal from "@components/ui/Modal";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import PromoteSignModal from "@components/feature/workspace/PromoteSignModal";
import { SignUsageSection, type SignUsage } from "@components/feature/dashboard/SignUsageSection";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";
import { MemberSection, type Member } from "@/components/feature/classroom-detail/MemberSection";
import { AddMemberForm } from "@/components/feature/classroom-detail/AddMemberForm";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { getAvatarUrl } from "@lib/constants/avatars";
import { ClassroomForm } from "@components/feature/classroom/ClassroomForm";
import { SignForm } from "@components/feature/workspace/SignForm";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Bookshelf01Icon,
    ChartIcon,
    Note01Icon,
    TaskDaily01Icon,
    Edit02Icon,
    FavouriteIcon,
    HandPointingLeft02Icon,
    Logout03Icon,
    Settings02Icon,
    SignLanguageCIcon,
    SquareLock02Icon,
    UserAdd01Icon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";
import NavTabs from "@components/ui/NavTabs";
import EssayPromptSection from "@components/feature/context/EssayPromptSection";
import EssayExampleSection from "@components/feature/context/EssayExampleSection";

interface ClassroomDetail {
    id: string;
    name: string;
    description?: string;
    colorBackground?: string;
    classCode?: string;
    isContext?: boolean;
    userCount: number;
    teacher: { id: string; name: string; avatar?: string; educatorType?: "TEACHER" | "INTERPRETER" | null };
}

type DetailView = "signs" | "usage" | "favorites" | "prompts" | "examples" | "settings";

const ClassroomDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [editModal, setEditModal] = useState(false);
    const [detailView, setDetailView] = useState<DetailView>("signs");
    const [editSignModal, setEditSignModal] = useState<{ open: boolean; signId?: string }>({ open: false });
    const [deleteSignModal, setDeleteSignModal] = useState<{ open: boolean; signId?: string; name?: string }>({ open: false });
    const [leaveModal, setLeaveModal] = useState(false);
    const [addMemberModal, setAddMemberModal] = useState(false);
    const [promoteModal, setPromoteModal] = useState<{ open: boolean; signId?: string; name?: string }>({ open: false });
    const [removeMemberModal, setRemoveMemberModal] = useState<{ open: boolean; member?: Member }>({ open: false });

    const [classroomQuery, signsQuery] = useQueries({
        queries: [
            {
                queryKey: queryKeys.classrooms.detail(id ?? ""),
                queryFn: () => unwrap(GetRequest<ClassroomDetail>(CLASSROOMS.FIND_ONE(id!))),
                enabled: !!id,
                meta: { errorMessage: "Falha ao carregar a turma" },
            },
            {
                queryKey: queryKeys.classrooms.signs(id ?? ""),
                queryFn: () => unwrap(GetRequest<SignCardData[]>(CLASSROOMS.SIGNS(id!))),
                enabled: !!id,
                meta: { errorMessage: "Falha ao carregar os sinais" },
            },
        ],
    });
    const classroom = classroomQuery.data ?? null;
    const signs = signsQuery.data ?? [];
    const loading = classroomQuery.isPending || signsQuery.isPending;

    // Abas carregam sob demanda: `enabled` só dispara quando a aba é aberta,
    // e o resultado fica em cache ao alternar de volta.
    const { data: favoritesSigns = [], isPending: loadingFavorites } = useQuery({
        queryKey: queryKeys.classrooms.signsFavorites(id ?? ""),
        queryFn: () => unwrap(GetRequest<SignCardData[]>(CLASSROOMS.SIGNS_FAVORITES(id!))),
        enabled: !!id && detailView === "favorites",
    });

    const { data: members = [], isPending: loadingMembers } = useQuery({
        queryKey: queryKeys.classrooms.members(id ?? ""),
        queryFn: () => unwrap(GetRequest<Member[]>(CLASSROOMS.MEMBERS(id!))),
        enabled: !!id && detailView === "settings",
    });

    // Visualização compacta de uso — só o professor da turma vê
    const canManageEarly = !!user?.roles?.includes("EDUCATOR") && classroom?.teacher.id === user?.id;
    const { data: usageStats, isPending: loadingUsage } = useQuery({
        queryKey: queryKeys.classrooms.usageStats(id ?? ""),
        queryFn: () => unwrap(GetRequest<{ mostUsed: SignUsage[]; leastUsed: SignUsage[] }>(CLASSROOMS.USAGE_STATS(id!), { limit: 5 })),
        enabled: !!id && canManageEarly && detailView === "usage",
    });

    const invalidateClassroom = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });

    const { mutate: deleteSign, variables: deletingVars, isPending: deletingSign } = useMutation({
        mutationFn: (signId: string) => unwrap(DeleteRequest(SIGNS.DELETE(signId))),
        onSuccess: () => {
            toast.success("Sinal excluído com sucesso!");
            setDeleteSignModal({ open: false });
            invalidateClassroom();
        },
        onError: (err: Error) => toast.error("Falha ao excluir sinal: " + err.message),
    });
    const deletingSignId = deletingSign ? deletingVars ?? null : null;

    const handleDeleteSign = () => {
        if (!deleteSignModal.signId) return;
        deleteSign(deleteSignModal.signId);
    };

    const { mutate: leaveClassroom, isPending: leaving } = useMutation({
        mutationFn: () => unwrap(DeleteRequest(CLASSROOMS.LEAVE(id!))),
        onSuccess: () => {
            toast.success("Você saiu da turma");
            invalidateClassroom();
            navigate("/classrooms");
        },
        onError: (err: Error) => toast.error("Falha ao sair da turma: " + err.message),
    });
    const handleLeave = () => leaveClassroom();

    const { mutate: promoteSign, isPending: promoting } = useMutation({
        mutationFn: (glossaryDisciplineIds: string[]) =>
            unwrap(PatchRequest(SIGNS.PROMOTE(promoteModal.signId!), { glossaryDisciplineIds })),
        onSuccess: () => {
            toast.success("Sinal enviado para aprovação do gestor!");
            setPromoteModal({ open: false });
            invalidateClassroom();
        },
        onError: (err: Error) => toast.error(err.message),
    });
    const handlePromoteSign = (ids: string[]) => {
        if (!promoteModal.signId) return;
        promoteSign(ids);
    };

    const { mutate: removeMember, isPending: removingMember } = useMutation({
        mutationFn: (memberUserId: string) =>
            unwrap(DeleteRequest(CLASSROOMS.REMOVE_MEMBER(id!, memberUserId))),
        onSuccess: () => {
            toast.success("Participante removido da turma");
            setRemoveMemberModal({ open: false });
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.members(id ?? "") });
        },
        onError: (err: Error) => toast.error("Falha ao remover participante: " + err.message),
    });
    const handleRemoveMember = () => {
        if (!removeMemberModal.member) return;
        removeMember(removeMemberModal.member.user.id);
    };

    // O carregamento por aba agora é feito pelo `enabled` das queries acima
    const handleTabChange = (tab: DetailView) => setDetailView(tab);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={32} color="#6B7280" />
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-lg font-semibold text-cloud-500">Turma não encontrada</p>
                <button onClick={() => navigate("/classrooms")} className="text-sm text-campfire-500 hover:underline">
                    Voltar para minhas turmas
                </button>
            </div>
        );
    }

    const canManage = !!user?.roles?.includes("EDUCATOR") && classroom.teacher.id === user?.id;
    const color = classroom.colorBackground || "#213547";

    return (
        <>
            <section className="flex flex-col gap-8">
                {/* Header da turma */}
                <div className="relative overflow-hidden rounded-3xl text-white" style={{ minHeight: 220 }}>
                    <CardMemphisBackground seed={classroom.id} color={color} rounded="rounded-3xl" />

                    {/* Botões flutuando no canto superior direito */}
                <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-20 flex items-center gap-2">
                    <button
                        onClick={() => navigate("/classrooms")}
                        className="flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 text-sm font-medium text-white"
                    >
                        <HugeiconsIcon icon={HandPointingLeft02Icon} size={18} />
                        Voltar
                    </button>

                    {/* Contexto é automática e do sistema — nem o gestor dono edita */}
                    {canManage && !classroom.isContext && (
                        <button
                            onClick={() => setEditModal(true)}
                            className="flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 text-sm font-medium text-white"
                        >
                            <HugeiconsIcon icon={Edit02Icon} size={18} />
                            Editar
                        </button>
                    )}
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8" style={{ minHeight: 220 }}>
                        {/* Nome + descrição (topo esquerdo) */}
                        <div>
                            <h1 className="font-baskerville text-2xl sm:text-3xl font-bold leading-tight drop-shadow">
                                {classroom.name}
                            </h1>
                            {classroom.description && (
                                <p className="mt-1.5 max-w-xl text-sm text-white/75 leading-snug">
                                    {classroom.description}
                                </p>
                            )}
                        </div>

                        {/* Meta (fundo) */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={SignLanguageCIcon} size={16} className="text-white/60" />
                                <span><b className="text-white">{signs.length}</b> sinais</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-white/60" />
                                <span><b className="text-white">{classroom.userCount}</b> membros</span>
                            </div>
                            {classroom.classCode && (
                                <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                                    <HugeiconsIcon icon={SquareLock02Icon} size={14} className="text-white/70" />
                                    Código: <span className="font-mono tracking-wider">{classroom.classCode}</span>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-white/60 text-xs">
                                {getAvatarUrl(classroom.teacher.avatar) && (
                                    <img
                                        src={getAvatarUrl(classroom.teacher.avatar)}
                                        alt={classroom.teacher.name}
                                        className="h-4 w-4 rounded-full object-cover"
                                    />
                                )}
                                Prof. {classroom.teacher.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav interna */}
                <NavTabs
                    active={detailView}
                    onChange={handleTabChange}
                    items={[
                        { key: "signs",     label: "Todos os sinais", icon: Bookshelf01Icon },
                        // Uso dos sinais — só o professor dono vê essa aba
                        ...(canManage ? [{ key: "usage" as const, label: "Uso", icon: ChartIcon }] : []),
                        { key: "favorites", label: "Favoritos",       icon: FavouriteIcon },
                        // A turma Contexto ganha as áreas do projeto de redação
                        ...(classroom.isContext
                            ? [
                                { key: "prompts" as const,  label: "Propostas", icon: TaskDaily01Icon },
                                { key: "examples" as const, label: "Exemplos",  icon: Note01Icon },
                            ]
                            : []),
                    ]}
                    endItems={[
                        { key: "settings", label: "Configurações", icon: Settings02Icon },
                    ]}
                />

                {/* View: Propostas de redação (só na turma Contexto) */}
                {detailView === "prompts" && classroom.isContext && (
                    <EssayPromptSection classroomId={classroom.id} canManage={canManage} />
                )}

                {/* View: Exemplos de redação (só na turma Contexto) */}
                {detailView === "examples" && classroom.isContext && (
                    <EssayExampleSection classroomId={classroom.id} canManage={canManage} />
                )}

                {/* View: Todos os sinais */}
                {detailView === "signs" && (
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-baskerville text-xl text-cloud-500">Sinais cadastrados</h2>
                            {/* <span className="text-xs text-neutral-400">Ordenado por nome</span> */}
                        </div>

                        {signs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                                <HugeiconsIcon icon={SignLanguageCIcon} size={36} className="text-cloud-300" />
                                <p className="text-sm text-neutral-500">
                                    Nenhum sinal cadastrado nesta turma ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {signs.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        canManage={canManage}
                                        onClick={() => navigate(`/signs/${sign.slug}`)}
                                        onEdit={() => setEditSignModal({ open: true, signId: sign.id })}
                                        onDelete={() => setDeleteSignModal({ open: true, signId: sign.id, name: sign.name })}
                                        onPromote={() => setPromoteModal({ open: true, signId: sign.id, name: sign.name })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* View: Uso dos sinais — só o professor dono */}
                {detailView === "usage" && canManage && (
                    <div className="flex flex-col gap-5">
                        <h2 className="font-baskerville text-xl text-cloud-500">Uso dos sinais</h2>
                        <SignUsageSection
                            mostUsed={usageStats?.mostUsed ?? []}
                            leastUsed={usageStats?.leastUsed ?? []}
                            loading={loadingUsage}
                        />
                    </div>
                )}

                {/* View: Favoritos */}
                {detailView === "favorites" && (
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-baskerville text-xl text-cloud-500">Sinais favoritos</h2>
                            {!loadingFavorites && (
                                <span className="text-xs text-neutral-400">{favoritesSigns.length} sinais</span>
                            )}
                        </div>

                        {loadingFavorites ? (
                            <div className="flex items-center justify-center py-16">
                                <Spinner size={28} color="#6B7280" />
                            </div>
                        ) : favoritesSigns.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                                <HugeiconsIcon icon={FavouriteIcon} size={36} className="text-cloud-300" />
                                <p className="text-sm text-neutral-500">
                                    Nenhum sinal favoritado nesta turma ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {favoritesSigns.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        canManage={canManage}
                                        isFavorite
                                        onClick={() => navigate(`/signs/${sign.slug}`)}
                                        onEdit={() => setEditSignModal({ open: true, signId: sign.id })}
                                        onDelete={() => setDeleteSignModal({ open: true, signId: sign.id, name: sign.name })}
                                        onPromote={() => setPromoteModal({ open: true, signId: sign.id, name: sign.name })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* View: Participantes */}
                {detailView === "settings" && (
                    <div className="flex flex-col gap-8">
                        {loadingMembers ? (
                            <div className="flex items-center justify-center py-16">
                                <Spinner size={28} color="#6B7280" />
                            </div>
                        ) : (
                            <>
                                {/* Ação: adicionar participante (apenas educador) */}
                                {canManage && (
                                    <button
                                        onClick={() => setAddMemberModal(true)}
                                        className="flex items-center justify-center gap-2 self-start rounded-2xl bg-cloud-500 hover:bg-cloud-600 transition-colors px-4 py-2.5 text-sm font-semibold text-white"
                                    >
                                        <HugeiconsIcon icon={UserAdd01Icon} size={18} />
                                        Adicionar participante
                                    </button>
                                )}

                                {/* Membros — educadores e alunos numa lista só; o RoleBadge de cada
                                    linha já distingue quem é quem */}
                                <MemberSection
                                    title="Membros"
                                    members={[
                                        // Professor da turma sempre aparece primeiro
                                        { roleInClass: "EDUCATOR", createdAt: "", user: { id: classroom.teacher.id, name: classroom.teacher.name, avatar: classroom.teacher.avatar, role: "EDUCATOR", educatorType: classroom.teacher.educatorType } },
                                        ...members.filter((m) => m.user.id !== classroom.teacher.id),
                                    ]}
                                    onRemove={canManage ? (m) => setRemoveMemberModal({ open: true, member: m }) : undefined}
                                    lockedUserIds={[classroom.teacher.id]}
                                />

                                {!canManage && (
                                    <button
                                        onClick={() => setLeaveModal(true)}
                                        className="flex items-center justify-center gap-2 self-start rounded-2xl bg-salmon-100 hover:bg-salmon-200 transition-colors px-4 py-2 text-sm font-medium text-salmon-600"
                                    >
                                        <HugeiconsIcon icon={Logout03Icon} size={18} />
                                        Sair da turma
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </section>

            {/* Modal de editar turma */}
            <Modal open={editModal} onClose={() => setEditModal(false)}>
                <ClassroomForm
                    classroomId={classroom.id}
                    onClose={() => setEditModal(false)}
                    onSuccess={() => { setEditModal(false); invalidateClassroom(); }}
                />
            </Modal>

            {/* Modal de editar sinal */}
            <Modal open={editSignModal.open} onClose={() => setEditSignModal({ open: false })} size="2xl">
                <SignForm
                    signId={editSignModal.signId}
                    onClose={() => setEditSignModal({ open: false })}
                    onSuccess={() => { setEditSignModal({ open: false }); invalidateClassroom(); }}
                />
            </Modal>

            {/* Modal de confirmar exclusão de sinal */}
            <ConfirmDeleteModal
                open={deleteSignModal.open}
                onClose={() => setDeleteSignModal({ open: false })}
                onConfirm={handleDeleteSign}
                loading={deletingSignId !== null}
                title={<>Excluir <span className="text-salmon-600 italic">Sinal</span>?</>}
                description={
                    <>
                        O sinal{" "}
                        <span className="font-semibold text-salmon-600 italic">{deleteSignModal.name}</span>{" "}
                        será removido permanentemente. Esta ação não pode ser desfeita.
                    </>
                }
                confirmText="Excluir sinal"
            />

            {/* Modal de confirmar promoção de sinal */}
            <PromoteSignModal
                open={promoteModal.open}
                onClose={() => setPromoteModal({ open: false })}
                onConfirm={handlePromoteSign}
                loading={promoting}
                signName={promoteModal.name}
            />

            {/* Modal de adicionar participante */}
            <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} size="2xl">
                <AddMemberForm
                    classroomId={classroom.id}
                    onClose={() => setAddMemberModal(false)}
                    onSuccess={() => { setAddMemberModal(false); invalidateClassroom(); }}
                />
            </Modal>

            {/* Modal de confirmar remoção de participante */}
            <ConfirmDeleteModal
                open={removeMemberModal.open}
                onClose={() => setRemoveMemberModal({ open: false })}
                onConfirm={handleRemoveMember}
                loading={removingMember}
                title={<>Remover <span className="text-salmon-600 italic">Participante</span>?</>}
                description={
                    <>
                        <span className="font-semibold text-salmon-600 italic">{removeMemberModal.member?.user.name}</span>{" "}
                        deixará de ter acesso a esta turma. É possível adicioná-lo novamente depois.
                    </>
                }
                confirmText="Remover participante"
                loadingText="Removendo"
            />

            {/* Modal de confirmar saída da turma */}
            <ConfirmDeleteModal
                open={leaveModal}
                onClose={() => setLeaveModal(false)}
                onConfirm={handleLeave}
                loading={leaving}
                title={<>Sair da <span className="text-salmon-600 italic">Turma</span>?</>}
                description={
                    <>
                        Você deixará de ter acesso aos sinais e materiais de{" "}
                        <span className="font-semibold text-salmon-600 italic">{classroom.name}</span>.
                        Para voltar, será necessário um novo convite.
                    </>
                }
                confirmText="Sair da turma"
                loadingText="Saindo"
            />
        </>
    );
};

export default ClassroomDetailPage;
