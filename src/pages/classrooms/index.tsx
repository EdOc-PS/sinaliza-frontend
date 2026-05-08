import { useAuth } from "@context/AuthContext"
import { SchoolBell01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect } from "react"
import { GetRequest, DeleteRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";

import { toast } from "sonner";

import { DisciplineForm } from "@/components/feature/classroom/DisciplineForm";
import { JoinDisciplineForm } from "@/components/feature/classroom/JoinDisciplineForm";
import { CreateClassroomCard } from "@components/feature/classroom/CreateClassroomCard";
import { JoinClassroomCard } from "@components/feature/classroom/JoinClassroomCard";
import { ClassroomFAB } from "@components/feature/classroom/ClassroomFAB";
import { DisciplineCard } from "@/components/feature/classroom/DisciplineCard";
import { ConfirmDeleteDicipline } from "@/components/feature/classroom/ConfirmDeleteDicipline";
import Spinner from "@/components/ui/Spinner";
import Modal from "@components/ui/Modal";

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
    classCode: string;
    userCount: number;
    canManage: boolean;
}

const ClassroomsPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [classCards, setClassCards] = useState<CardsDicipline[]>([]);

    const [formModal, setFormModal] = useState<{ open: boolean; disciplineId?: string; mode?: "create" | "edit" | "join" }>({ open: false });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; disciplineId?: string; name?: string }>({ open: false });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const getClassrooms = async () => {
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
    };

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
    }, []);

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

                    <div className="grid grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-2 flex items-center justify-center py-10">
                                <Spinner size={32} color="#6B7280" />
                            </div>
                        ) : (
                            <>
                                {classCards.map((card) => (
                                    <DisciplineCard
                                        key={card.id}
                                        dicipline={card}
                                        onEdit={() => setFormModal({ open: true, disciplineId: card.id, mode: "edit" })}
                                        onDelete={() => handleDeleteClick(card.id, card.name)}
                                    />
                                ))}
                                {user?.role === "EDUCATOR" && (
                                    <CreateClassroomCard onClick={() => setFormModal({ open: true, mode: "create" })} />
                                )}
                                <JoinClassroomCard onClick={() => setFormModal({ open: true, mode: "join" })} />

                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FAB */}
            <ClassroomFAB
                userRole={user?.role}
                onCreateClick={() => setFormModal({ open: true, mode: "create" })}
                onJoinClick={() => setFormModal({ open: true, mode: "join" })}
            />

            {/* Modal criar / editar / entrar em turma */}
            <Modal open={formModal.open} onClose={() => setFormModal({ open: false })}>
                {formModal.mode === "join" ? (
                    <JoinDisciplineForm
                        onClose={() => setFormModal({ open: false })}
                        onSuccess={() => { setFormModal({ open: false }); getClassrooms(); }}
                    />
                ) : (
                    <DisciplineForm
                        disciplineId={formModal.disciplineId}
                        onClose={() => setFormModal({ open: false })}
                        onSuccess={() => { setFormModal({ open: false }); getClassrooms(); }}
                    />
                )}
            </Modal>

            {/* Modal de confirmação de delete */}
            <ConfirmDeleteDicipline
                open={deleteModal.open}
                disciplineName={deleteModal.name}
                loading={deletingId !== null}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModal({ open: false })}
            />
        </>
    );
};

export default ClassroomsPage;
