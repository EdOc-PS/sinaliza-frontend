import { useAuth } from "@context/AuthContext"
import { SchoolBell01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect } from "react"
import { GetRequest, PostRequest, DeleteRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";

import { toast } from "sonner";

import { CreateDiscipline, PRESET_COLORS } from "@/components/feature/classroom/CreateDisciplineForm";
import { CreateClassroomCard } from "@components/feature/classroom/CreateClassroomCard";
import { DisciplineCard } from "@/components/feature/classroom/DisciplineCard";
import { ConfirmDeleteDicipline } from "@/components/feature/classroom/ConfirmDeleteDicipline";
import Spinner from "@/components/ui/Spinner";
import Modal from "@components/ui/Modal";


export interface CreateDisciplineForm {
    name: string;
    description?: string
    colorBackground: string;
    schoolYear?: number;
    schoolLevel?: string;
}

export interface CardsDicipline {
    id: string;
    name: string;
    teacher: {
        name: string;
        avatar?: string;
    };
    description: string;
    colorBackground: string;
    schoolYear?: number;
    schoolLevel?: string;
    classCode: string;
    userCount: number;
}

const ClassroomsPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [viewCreateModal, setViewCreateModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; disciplineId?: string; name?: string }>({ open: false });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [classCards, setClassCards] = useState<CardsDicipline[]>([]);

    // Formulário de criação de turma
    const [form, setForm] = useState<CreateDisciplineForm>({
        name: "",
        description: "",
        colorBackground: PRESET_COLORS[0].hex,
        schoolYear: Number(new Date().getFullYear())
    });

    const handleChange = (field: keyof CreateDisciplineForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setViewCreateModal(false);
        setForm({
            name: "",
            description: "",
            colorBackground: PRESET_COLORS[0].hex,
            schoolYear: Number(new Date().getFullYear()),
            schoolLevel: undefined,
        });
    };

    const isValid = form.name.trim().length >= 3;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setLoading(true);
        try {
            const response = await PostRequest<CreateDisciplineForm>(DISCIPLINES.CREATE(), form);

            if (!response.success) {
                toast.error("Falha ao criar disciplina: " + response.message);
                return;
            }
            toast.success("Disciplina criada com sucesso!");
            getClassrooms();
            handleClose();

        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
        } finally {
            setLoading(false);
        }
    };

    const getClassrooms = async () => {
        setLoading(true);
        try {
            const response = await GetRequest<CardsDicipline[]>(DISCIPLINES.MINE());

            if (!response.success) {
                toast.error("Falha ao obter suas turmas: " + response.message);
                return;
            }
            setClassCards(response.object || []);

        } catch (error) {
            console.error('Erro ao buscar suas turmas:', error);
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
            const response = await DeleteRequest(`disciplines/${deleteModal.disciplineId}`);

            if (!response.success) {
                toast.error("Falha ao deletar turma: " + response.message);
                return;
            }
            toast.success("Turma deletada com sucesso!");
            setDeleteModal({ open: false });
            getClassrooms();

        } catch (error) {
            console.error('Erro ao deletar turma:', error);
            toast.error("Erro ao deletar turma");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ open: false });
    };

    useEffect(() => {
        getClassrooms();
    }, []);

    return (
        <>
            <section className="flex flex-col gap-10">
                {/* Saudação */}
                <div className="bg-white rounded-3xl p-6">
                    <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                        Olá,
                        <span className="font-baskerville text-campfire-500 italic"> {user?.name ?? "professor"}</span>
                    </p>
                    <p className="text-neutral-600 text-md">Bem-vindo de volta!</p>
                </div>

                {/* Lista de turmas */}
                <div className="flex flex-col gap-6 ">
                    <div className="flex items-center gap-2">
                        <h1 className="font-baskerville text-lg text-cloud-500">Minhas turmas</h1>
                        <div className="flex items-center gap-2 py-1 px-3 bg-neutral-200/60 rounded-xl">
                            <HugeiconsIcon icon={SchoolBell01Icon} size={18} className="text-neutral-500" />
                            <p className="text-neutral-500 text-sm">0</p>
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
                                        onDelete={() => handleDeleteClick(card.id, card.name)}
                                    />
                                ))
                                }
                                < CreateClassroomCard onClick={() => setViewCreateModal(true)} />
                            </>
                        )}

                    </div>
                </div>
            </section>

            {/* Modal de criar turma */}
            <Modal open={viewCreateModal} onClose={handleClose}>
                <CreateDiscipline
                    onClose={handleClose}
                    form={form}
                    onFormChange={handleChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    isValid={isValid}
                />
            </Modal>

            {/* Modal de confirmação de delete */}
            <ConfirmDeleteDicipline
                open={deleteModal.open}
                disciplineName={deleteModal.name}
                loading={deletingId !== null}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </>
    );
};

export default ClassroomsPage;
