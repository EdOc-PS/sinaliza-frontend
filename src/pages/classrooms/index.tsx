import { useAuth } from "@context/AuthContext"
import { SchoolBell01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
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
    canManage: boolean;
    /** Turma automática de redação — não pode ser editada nem excluída, nem pelo gestor dono */
    isContext: boolean;
}

const ClassroomsPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

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

                {/* Lista de turmas */}
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
