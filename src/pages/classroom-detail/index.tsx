import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteRequest, GetRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";
import { SIGNS } from "@routes/signs";
import { useAuth } from "@context/AuthContext";

import Spinner from "@components/ui/Spinner";
import Modal from "@components/ui/Modal";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";
import { MemberSection, type Member } from "@/components/feature/classroom-detail/MemberSection";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { DisciplineForm } from "@components/feature/classroom/DisciplineForm";
import { SignForm } from "@components/feature/workspace/SignForm";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Bookshelf01Icon,
    Edit02Icon,
    FavouriteIcon,
    HandPointingLeft02Icon,
    Logout03Icon,
    Settings02Icon,
    SignLanguageCIcon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";
import NavTabs from "@components/ui/NavTabs";

interface DisciplineDetail {
    id: string;
    name: string;
    description?: string;
    colorBackground?: string;
    schoolYear?: number;
    schoolLevelLabel?: string;
    userCount: number;
    teacher: { id: string; name: string; avatar?: string; educatorType?: "TEACHER" | "INTERPRETER" | null };
}

const ClassroomDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [discipline, setDiscipline] = useState<DisciplineDetail | null>(null);
    const [signs, setSigns] = useState<SignCardData[]>([]);
    const [editModal, setEditModal] = useState(false);
    const [detailView, setDetailView] = useState<"signs" | "favorites" | "settings">("signs");
    const [favoritesSigns, setFavoritesSigns] = useState<SignCardData[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const [editSignModal, setEditSignModal] = useState<{ open: boolean; signId?: string }>({ open: false });
    const [deleteSignModal, setDeleteSignModal] = useState<{ open: boolean; signId?: string; name?: string }>({ open: false });
    const [deletingSignId, setDeletingSignId] = useState<string | null>(null);
    const [leaveModal, setLeaveModal] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const handleDeleteSign = async () => {
        if (!deleteSignModal.signId) return;
        setDeletingSignId(deleteSignModal.signId);
        try {
            const res = await DeleteRequest(SIGNS.DELETE(deleteSignModal.signId));
            if (!res.success) { toast.error("Falha ao excluir sinal: " + res.message); return; }
            toast.success("Sinal excluído com sucesso!");
            setDeleteSignModal({ open: false });
            load();
        } finally {
            setDeletingSignId(null);
        }
    };

    const load = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [disciplineRes, signsRes] = await Promise.all([
                GetRequest<DisciplineDetail>(DISCIPLINES.FIND_ONE(id)),
                GetRequest<SignCardData[]>(DISCIPLINES.SIGNS(id)),
            ]);

            if (!disciplineRes.success) {
                toast.error("Falha ao carregar a disciplina: " + disciplineRes.message);
                return;
            }
            setDiscipline(disciplineRes.object ?? null);
            setSigns(signsRes.object ?? []);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadDisciplineFavorites = async () => {
        if (!id) return;
        setLoadingFavorites(true);
        try {
            const res = await GetRequest<SignCardData[]>(DISCIPLINES.SIGNS_FAVORITES(id));
            setFavoritesSigns(res.object ?? []);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const loadMembers = async () => {
        if (!id) return;
        setLoadingMembers(true);
        try {
            const res = await GetRequest<Member[]>(DISCIPLINES.MEMBERS(id));
            setMembers(res.object ?? []);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleLeave = async () => {
        if (!id) return;
        setLeaving(true);
        try {
            const res = await DeleteRequest(DISCIPLINES.LEAVE(id));
            if (!res.success) { toast.error("Falha ao sair da disciplina: " + res.message); return; }
            toast.success("Você saiu da disciplina");
            navigate("/classrooms");
        } finally {
            setLeaving(false);
        }
    };

    const handleTabChange = (tab: "signs" | "favorites" | "settings") => {
        setDetailView(tab);
        if (tab === "favorites" && favoritesSigns.length === 0) loadDisciplineFavorites();
        if (tab === "settings" && members.length === 0) loadMembers();
    };

    useEffect(() => {
        load();
    }, [load]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={32} color="#6B7280" />
            </div>
        );
    }

    if (!discipline) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-lg font-semibold text-cloud-500">Disciplina não encontrada</p>
                <button onClick={() => navigate("/classrooms")} className="text-sm text-campfire-500 hover:underline">
                    Voltar para minhas turmas
                </button>
            </div>
        );
    }

    const canManage = user?.role === "EDUCATOR" && discipline.teacher.id === user?.id;
    const color = discipline.colorBackground || "#213547";

    return (
        <>
            <section className="flex flex-col gap-8">
                {/* Header da disciplina */}
                <div className="relative overflow-hidden rounded-3xl text-white" style={{ minHeight: 220 }}>
                    <CardMemphisBackground seed={discipline.id} color={color} rounded="rounded-3xl" />

                    {/* Botões flutuando no canto superior direito */}
                <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-20 flex items-center gap-2">
                    <button
                        onClick={() => navigate("/classrooms")}
                        className="flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 text-sm font-medium text-white"
                    >
                        <HugeiconsIcon icon={HandPointingLeft02Icon} size={18} />
                        Voltar
                    </button>

                    {canManage && (
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
                                {discipline.name}
                            </h1>
                            {discipline.description && (
                                <p className="mt-1.5 max-w-xl text-sm text-white/75 leading-snug">
                                    {discipline.description}
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
                                <span><b className="text-white">{discipline.userCount}</b> alunos</span>
                            </div>
                            <span className="text-white/60 text-xs">
                                Prof. {discipline.teacher.name}
                                {discipline.schoolYear ? ` · ${discipline.schoolYear}` : ""}
                                {discipline.schoolLevelLabel ? ` · ${discipline.schoolLevelLabel}` : ""}
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
                        { key: "favorites", label: "Favoritos",       icon: FavouriteIcon },
                    ]}
                    endItems={[
                        { key: "settings", label: "Configurações", icon: Settings02Icon },
                    ]}
                />

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
                                    Nenhum sinal cadastrado nesta disciplina ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {signs.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        canManage={canManage}
                                        onClick={() => navigate(`/signs/${sign.id}`)}
                                        onEdit={() => setEditSignModal({ open: true, signId: sign.id })}
                                        onDelete={() => setDeleteSignModal({ open: true, signId: sign.id, name: sign.name })}
                                    />
                                ))}
                            </div>
                        )}
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
                                    Nenhum sinal favoritado nesta disciplina ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {favoritesSigns.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        canManage={canManage}
                                        isFavorite
                                        onClick={() => navigate(`/signs/${sign.id}`)}
                                        onEdit={() => setEditSignModal({ open: true, signId: sign.id })}
                                        onDelete={() => setDeleteSignModal({ open: true, signId: sign.id, name: sign.name })}
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
                                {/* Educadores */}
                                <MemberSection
                                    title="Educadores"
                                    members={[
                                        // Professor da disciplina sempre aparece primeiro
                                        { roleInClass: "EDUCATOR", createdAt: "", user: { id: discipline.teacher.id, name: discipline.teacher.name, avatar: discipline.teacher.avatar, role: "EDUCATOR", educatorType: discipline.teacher.educatorType } },
                                        ...members.filter((m) => ["EDUCATOR", "INTERPRETER"].includes(m.roleInClass) && m.user.id !== discipline.teacher.id),
                                    ]}
                                />

                                {/* Alunos */}
                                <MemberSection
                                    title="Alunos"
                                    members={members.filter((m) => ["STUDENT", "GUARDIAN"].includes(m.roleInClass))}
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

            {/* Modal de editar disciplina */}
            <Modal open={editModal} onClose={() => setEditModal(false)}>
                <DisciplineForm
                    disciplineId={discipline.id}
                    onClose={() => setEditModal(false)}
                    onSuccess={() => { setEditModal(false); load(); }}
                />
            </Modal>

            {/* Modal de editar sinal */}
            <Modal open={editSignModal.open} onClose={() => setEditSignModal({ open: false })} size="2xl">
                <SignForm
                    signId={editSignModal.signId}
                    onClose={() => setEditSignModal({ open: false })}
                    onSuccess={() => { setEditSignModal({ open: false }); load(); }}
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

            {/* Modal de confirmar saída da disciplina */}
            <ConfirmDeleteModal
                open={leaveModal}
                onClose={() => setLeaveModal(false)}
                onConfirm={handleLeave}
                loading={leaving}
                title={<>Sair da <span className="text-salmon-600 italic">Turma</span>?</>}
                description={
                    <>
                        Você deixará de ter acesso aos sinais e materiais de{" "}
                        <span className="font-semibold text-salmon-600 italic">{discipline.name}</span>.
                        Para voltar, será necessário um novo convite.
                    </>
                }
                confirmText="Sair da turma"
                loadingText="Saindo..."
            />
        </>
    );
};

export default ClassroomDetailPage;
