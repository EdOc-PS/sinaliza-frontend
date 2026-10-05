import { useAuth } from "@context/AuthContext"
import { SchoolBell01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"
import { SEARCH } from "@routes/search";
import Button from "@components/ui/Button";
import { SignCard, type SignCardData } from "@components/feature/classroom-detail/SignCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetRequest, DeleteRequest } from "@requests";
import { CLASSROOMS } from "@routes/classrooms";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";

import { toast } from "sonner";

import { ClassroomForm } from "@components/feature/classroom/ClassroomForm";
import { CreateClassroomCard } from "@components/feature/classroom/CreateClassroomCard";
import { JoinClassroomCard } from "@components/feature/classroom/JoinClassroomCard";
import { ClassroomCard } from "@components/feature/classroom/ClassroomCard";

import Spinner from "@components/ui/Spinner";
import Modal from "@components/ui/Modal";
import ConfirmDeleteModal from "@/components/layout/ConfirmDeleteModal";
import {
    SignFiltersCard,
    EMPTY_SIGN_FILTERS,
    countActiveFilters,
    filtersToParams,
    type SignFilters,
} from "@components/feature/glossary/SignFiltersCard";
import { useSignFilterOptions } from "@components/feature/glossary/useSignFilterOptions";
import { useNavigate } from "react-router-dom";

export interface CreateClassroomForm {
    name: string;
    description?: string;
    colorBackground: string;
}

export interface ClassroomCardData {
    id: string;
    name: string;
    teacherName: string;
    teacherAvatar?: string | null;
    description: string;
    colorBackground: string;
    classCode: string;
    userCount: number;
    /** Sinais criados desde a última visita do usuário à turma */
    newSignsCount?: number;
    canManage: boolean;
    /** Turma automática de redação — não pode ser editada nem excluída, nem pelo gestor dono */
    isContext: boolean;
}

const ClassroomsPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { categories, disciplines } = useSignFilterOptions();

    // Busca de sinais das turmas: os resultados ocupam o lugar dos cards de turma,
    // sem sair da tela. Limpar os filtros volta para a lista de turmas.
    const [filters, setFilters] = useState<SignFilters>(EMPTY_SIGN_FILTERS);
    const resultsRef = useRef<HTMLDivElement>(null);
    const searching = !!filters.query.trim() || countActiveFilters(filters) > 0;
    const searchParams = filtersToParams(filters);

    const { data: foundSigns = [], isPending: loadingSigns } = useQuery({
        queryKey: queryKeys.search.signs({
            search: filters.query,
            handConfigId: searchParams.handConfigId,
            categoryId: searchParams.categoryId,
            glossaryDisciplineId: searchParams.glossaryDisciplineId,
        }),
        queryFn: () => unwrap(GetRequest<SignCardData[]>(SEARCH.SIGNS(), searchParams)),
        enabled: searching,
        meta: { errorMessage: "Falha na busca" },
    });

    const [editModal, setEditModal] = useState<{ open: boolean; classroomId?: string }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; classroomId?: string; name?: string }>({ open: false });

    // O cache vive fora do componente: ao voltar para esta tela a lista já
    // aparece preenchida e a revalidação acontece em segundo plano.
    const { data: classCards = [], isPending: loading } = useQuery({
        queryKey: queryKeys.classrooms.mine(),
        queryFn: () => unwrap(GetRequest<ClassroomCardData[]>(CLASSROOMS.MINE())),
        meta: { errorMessage: "Falha ao obter suas turmas" },
    });

    const { mutate: deleteClassroom, isPending: deleting } = useMutation({
        mutationFn: (id: string) => unwrap(DeleteRequest(CLASSROOMS.DELETE(id))),
        onSuccess: () => {
            toast.success("Turma deletada com sucesso!");
            setDeleteModal({ open: false });
            // Marca toda chave que comeca com ["classrooms"] como desatualizada
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
        },
        onError: (err: Error) => toast.error("Falha ao deletar turma: " + err.message),
    });

    const handleDeleteClick = (classroomId: string, classroomName: string) => {
        setDeleteModal({ open: true, classroomId, name: classroomName });
    };

    const handleDeleteConfirm = () => {
        if (!deleteModal.classroomId) return;
        deleteClassroom(deleteModal.classroomId);
    };

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="bg-white rounded-3xl p-6">
                    <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                        Olá,
                        <span className="font-baskerville text-campfire-500 italic"> {user?.name ?? "professor"}</span>
                    </p>
                    <p className="text-neutral-600 text-md">Bem-vindo de volta!</p>
                </div>

                <SignFiltersCard
                    value={filters}
                    onApply={setFilters}
                    categories={categories}
                    disciplines={disciplines}
                    subtitle="Procure entre os sinais de todas as suas turmas."
                    placeholder="Buscar sinal..."
                    resultsRef={resultsRef}
                />

                {/* Resultados da busca (no lugar das turmas) */}
                <div ref={resultsRef} className="scroll-mt-6">
                {searching ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <h1 className="font-baskerville text-lg text-cloud-500">Resultados da busca</h1>
                                {!loadingSigns && (
                                    <div className="flex items-center gap-2 py-1 px-3 bg-neutral-200/60 rounded-xl">
                                        <HugeiconsIcon icon={Search01Icon} size={18} className="text-neutral-500" />
                                        <p className="text-neutral-500 text-sm">{foundSigns.length}</p>
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={SchoolBell01Icon}
                                iconSize={16}
                                onClick={() => setFilters(EMPTY_SIGN_FILTERS)}
                            >
                                Voltar às turmas
                            </Button>
                        </div>

                        {loadingSigns ? (
                            <div className="flex items-center justify-center py-10">
                                <Spinner size={32} color="#6B7280" />
                            </div>
                        ) : foundSigns.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                                <HugeiconsIcon icon={Search01Icon} size={40} className="text-cloud-300" />
                                <p className="text-sm font-medium text-cloud-500">Nenhum sinal encontrado</p>
                                <p className="text-xs text-neutral-400">Ajuste os filtros e tente novamente.</p>
                            </div>
                        ) : (
                            <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {foundSigns.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        onClick={() => navigate(`/signs/${sign.slug}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                /* Lista de turmas */
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <h1 className="font-baskerville text-lg text-cloud-500">Minhas turmas</h1>
                        <div className="flex items-center gap-2 py-1 px-3 bg-neutral-200/60 rounded-xl">
                            <HugeiconsIcon icon={SchoolBell01Icon} size={18} className="text-neutral-500" />
                            <p className="text-neutral-500 text-sm">{classCards.length}</p>
                        </div>
                    </div>

                    <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {loading ? (
                            <div className="col-span-full flex items-center justify-center py-10">
                                <Spinner size={32} color="#6B7280" />
                            </div>
                        ) : (
                            <>
                                {classCards.map((card) => (
                                    <ClassroomCard
                                        key={card.id}
                                        classroom={card}
                                        onEdit={() => setEditModal({ open: true, classroomId: card.id })}
                                        onDelete={() => handleDeleteClick(card.id, card.name)}
                                    />
                                ))}
                                {user?.roles?.includes("EDUCATOR") && (
                                    <CreateClassroomCard />
                                )}
                                <JoinClassroomCard />
                            </>
                        )}
                    </div>
                </div>
                )}
                </div>
            </section>

            {/* Modal: editar turma */}
            <Modal open={editModal.open} onClose={() => setEditModal({ open: false })}>
                <ClassroomForm
                    classroomId={editModal.classroomId}
                    onClose={() => setEditModal({ open: false })}
                    onSuccess={() => { setEditModal({ open: false }); queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all }); }}
                />
            </Modal>

            {/* Modal de confirmação de delete */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDeleteConfirm}
                loading={deleting}
                title={<>Excluir <span className="text-salmon-600 italic">Turma</span>?</>}
                description={
                    <>
                        A turma{" "}
                        <span className="font-semibold text-salmon-600 italic">{deleteModal.name}</span>{" "}
                        será removida permanentemente. Os alunos perderão o acesso e todos os sinais
                        provisórios serão apagados. Esta ação não pode ser desfeita.
                    </>
                }
                confirmText="Excluir turma"
            />
        </>
    );
};

export default ClassroomsPage;
