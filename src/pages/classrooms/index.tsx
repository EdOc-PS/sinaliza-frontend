import { useAuth } from "@context/AuthContext"
import { SchoolBell01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useCallback } from "react"
import { GetRequest, DeleteRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";
import { useFAB } from "@context/FABContext";

import { toast } from "sonner";

import { DisciplineForm } from "@components/feature/classroom/DisciplineForm";
import { CreateClassroomCard } from "@components/feature/classroom/CreateDisciplineCard";
import { JoinClassroomCard } from "@components/feature/classroom/JoinDiciplineCard";
import { DisciplineCard } from "@components/feature/classroom/DisciplineCard";

import Spinner from "@components/ui/Spinner";
import Modal from "@components/ui/Modal";
import ConfirmDeleteModal from "@/components/layout/ConfirmDeleteModal";

export interface CreateDisciplineForm {
    name: string;
    description?: string;
    colorBackground: string;
    schoolYear?: number;
    schoolLevel?: string;
}

export interface CardsDicipline {
    id: string;
    name: string;
    teacherName: string;
    description: string;
    colorBackground: string;
    schoolYear?: number;
    schoolLevel?: string;
    schoolLevelLabel?: string;
    classCode: string;
    userCount: number;
    canManage: boolean;
}

const ClassroomsPage = () => {
    const { user } = useAuth();
    const { registerRefresh } = useFAB();

    const [loading, setLoading] = useState<boolean>(false);
    const [classCards, setClassCards] = useState<CardsDicipline[]>([]);

    const [editModal, setEditModal] = useState<{ open: boolean; disciplineId?: string }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; disciplineId?: string; name?: string }>({ open: false });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const getClassrooms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await GetRequest<CardsDicipline[]>(DISCIPLINES.MINE());
            if (!response.success) {
                toast.error("Falha ao obter suas turmas: " + response.message);
                return;
            }
            setClassCards(response.object || []);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteClick = (disciplineId: string, disciplineName: string) => {
        setDeleteModal({ open: true, disciplineId, name: disciplineName });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.disciplineId) return;

        setDeletingId(deleteModal.disciplineId);
        try {
            const response = await DeleteRequest(DISCIPLINES.DELETE(deleteModal.disciplineId));
            if (!response.success) {
                toast.error("Falha ao deletar turma: " + response.message);
                return;
            }
            toast.success("Turma deletada com sucesso!");
            setDeleteModal({ open: false });
            getClassrooms();
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        getClassrooms();
        registerRefresh(getClassrooms);
    }, [getClassrooms, registerRefresh]);

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

                {/* Lista de turmas */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <h1 className="font-baskerville text-lg text-cloud-500">Minhas turmas</h1>
                        <div className="flex items-center gap-2 py-1 px-3 bg-neutral-200/60 rounded-xl">
                            <HugeiconsIcon icon={SchoolBell01Icon} size={18} className="text-neutral-500" />
                            <p className="text-neutral-500 text-sm">{classCards.length}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {loading ? (
                            <div className="col-span-full flex items-center justify-center py-10">
                                <Spinner size={32} color="#6B7280" />
                            </div>
                        ) : (
                            <>
                                {classCards.map((card) => (
                                    <DisciplineCard
                                        key={card.id}
                                        dicipline={card}
                                        onEdit={() => setEditModal({ open: true, disciplineId: card.id })}
                                        onDelete={() => handleDeleteClick(card.id, card.name)}
                                    />
                                ))}
                                {user?.role === "EDUCATOR" && (
                                    <CreateClassroomCard />
                                )}
                                <JoinClassroomCard />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal: editar turma */}
            <Modal open={editModal.open} onClose={() => setEditModal({ open: false })}>
                <DisciplineForm
                    disciplineId={editModal.disciplineId}
                    onClose={() => setEditModal({ open: false })}
                    onSuccess={() => { setEditModal({ open: false }); getClassrooms(); }}
                />
            </Modal>

            {/* Modal de confirmação de delete */}
            <ConfirmDeleteModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                onConfirm={handleDeleteConfirm}
                loading={deletingId !== null}
                title={<>Excluir <span className="text-salmon-600 italic">Disciplina</span>?</>}
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
