import Modal from "@/components/ui/Modal";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import Button from "@components/ui/Button";
import { useAuth } from "@context/AuthContext"
import {
    SchoolBell01Icon,
    Book01Icon,
    Calendar01Icon,
    Layers01Icon,
    AddCircleIcon,
    TextSelectIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect } from "react"
import { GetRequest, PostRequest } from "@requests";
import { DISCIPLINES } from "@routes/disciplines";

import { toast } from "sonner";

import type { GenericOption } from "@interfaces";

// ── Cores predefinidas para a turma ──────────────────────────────────
const PRESET_COLORS = [
    { hex: "#BACA57", label: "Lime" },
    { hex: "#56B2D4", label: "Sky" },
    { hex: "#E6AB6E", label: "Campfire" },
    { hex: "#EEA2A2", label: "Salmon" },
    { hex: "#213547", label: "Cloud" },
];

interface CreateClassroomCardProps {
    onClick?: () => void;
}

interface CreateDisciplineForm {
    name: string;
    description: string
    colorBackground: string;
    schoolYear: number;
    schoolLevel: string;
}

const CreateClassroomCard = ({ onClick }: CreateClassroomCardProps) => (
    <button
        onClick={onClick}
        className="w-full group relative flex flex-col items-center justify-center gap-4 px-8 py-10 rounded-3xl border-2 border-dashed border-cloud-300 bg-cloud-50 transition-all duration-300 hover:border-sunflower-400 hover:bg-white focus:outline-none hover:-translate-y-1"
    >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-100 transition-all duration-300">
            <img src="src/assets/app/create-class.png" alt="" className="w-10 h-10" />
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-cloud-700 transition-colors duration-300">
                Criar nova turma
            </h3>
            <p className="text-sm text-cloud-400 transition-colors duration-300 group-hover:text-cloud-500">
                Configure nome e código
            </p>
        </div>
    </button>
);

interface CreateDisciplineModalProps {
    open: boolean;
    onClose: () => void;
    form: CreateDisciplineForm;
    onFormChange: (field: keyof CreateDisciplineForm, value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    loading: boolean;
    isValid: boolean;
    schoolLevelOptions: GenericOption[];
    loadingSchoolLevels: boolean;
}

const CreateDisciplineModal = ({
    open,
    onClose,
    form,
    onFormChange,
    onSubmit,
    loading,
    isValid,
    schoolLevelOptions,
    loadingSchoolLevels,
}: CreateDisciplineModalProps) => (
    <Modal open={open} onClose={onClose}>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Criar nova turma</h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    Defina o nome da disciplina. Um código de convite de 6 dígitos
                    será gerado automaticamente para que os estudantes participem.
                </p>
            </div>

            {/* Nome da turma */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="discipline-name">Nome da turma</Label>
                <Input
                    id="discipline-name"
                    icon={Book01Icon}
                    placeholder="Ex: Libras Básico"
                    value={form.name}
                    onChange={(v) => onFormChange("name", v)}
                    noSpecialChars={false}
                    autoFocus
                />
                <p className="text-xs text-cloud-400 pl-1">
                    Use um nome claro que ajude os alunos a identificar.
                </p>
            </div>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="discipline-description">Descrição</Label>
                <Input
                    id="discipline-description"
                    icon={TextSelectIcon}
                    placeholder="Ex: Libras Básico"
                    value={form.description}
                    onChange={(v) => onFormChange("description", v)}
                    noSpecialChars={false}
                    autoFocus
                />
            </div>

            {/* Ano e Nível escolar lado a lado */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="school-year">Ano letivo</Label>
                    <Input
                        id="school-year"
                        icon={Calendar01Icon}
                        type="number"
                        placeholder="Ex: 2026"
                        value={form.schoolYear}
                        onChange={(v) => onFormChange("schoolYear", v)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="school-level">Nível escolar</Label>
                    <Select
                        id="school-level"
                        icon={Layers01Icon}
                        placeholder={loadingSchoolLevels ? "Carregando..." : "Selecione"}
                        options={schoolLevelOptions}
                        value={form.schoolLevel}
                        onChange={(v) => onFormChange("schoolLevel", v)}
                        disabled={loadingSchoolLevels}
                    />
                </div>
            </div>

            {/* Cor de identificação */}
            <div className="flex flex-col gap-2.5">
                <Label>Cor de identificação</Label>
                <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(({ hex, label }) => (
                        <button
                            key={hex}
                            type="button"
                            title={label}
                            onClick={() => onFormChange("colorBackground", hex)}
                            className="relative w-9 h-9 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none"
                            style={{ backgroundColor: hex }}
                        >
                            {form.colorBackground === hex && (
                                <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-cloud-500" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="cloud"
                    className="flex-1"
                    disabled={!isValid || loading}
                >
                    {loading ? "Criando..." : "Criar turma"}
                </Button>
            </div>
        </form>
    </Modal>
);

const ClassroomsPage = () => {
    const { user } = useAuth();
    const [viewCreateModal, setViewCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [schoolLevelOptions, setSchoolLevelOptions] = useState<GenericOption[]>([]);
    const [loadingSchoolLevels, setLoadingSchoolLevels] = useState(false);

    const [form, setForm] = useState<CreateDisciplineForm>({
        name: "",
        description: "",
        colorBackground: PRESET_COLORS[0].hex,
        schoolYear: Number(new Date().getFullYear()),
        schoolLevel: "",
    });

    const fetchSchoolLevels = async () => {
        setLoadingSchoolLevels(true);
        try {
            const response = await GetRequest<GenericOption[]>(DISCIPLINES.OPTIONS());

            if (!response.success) {
                toast.error("Falha ao obter níveis escolares: " + response.message);
            }

            setSchoolLevelOptions(response.object || []);
        } catch (error) {
            console.error('Erro ao buscar níveis escolares:', error);
            setSchoolLevelOptions([]);
        } finally {
            setLoadingSchoolLevels(false);
        }
    };

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
            schoolLevel: "",
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
                toast.error("Falha ao obter níveis escolares: " + response.message);
                return;
            }
            toast.success("Turma criada com sucesso!");
            handleClose();

        } catch (error) {
            console.error('Erro ao buscar níveis escolares:', error);
            setSchoolLevelOptions([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSchoolLevels();
    }, []);

    return (
        <>
            <section className="flex flex-col gap-10">
                {/* Saudação */}
                <div>
                    <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                        Olá,
                        <span className="font-baskerville text-campfire-500 italic"> {user?.name ?? "professor"}</span>
                    </p>
                    <p className="text-neutral-600 text-md">Bem-vindo de volta!</p>
                </div>

                {/* Lista de turmas */}
                <div className="flex flex-col gap-6 bg-white rounded-3xl p-6">
                    <div className="flex items-center gap-2">
                        <h1 className="font-baskerville text-lg text-cloud-500">Minhas turmas</h1>
                        <div className="flex items-center gap-2 py-1 px-3 bg-neutral-200/60 rounded-xl">
                            <HugeiconsIcon icon={SchoolBell01Icon} size={18} className="text-neutral-500" />
                            <p className="text-neutral-500 text-sm">0</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CreateClassroomCard onClick={() => setViewCreateModal(true)} />
                    </div>
                </div>
            </section>

            {/* Modal de criar turma */}
            <CreateDisciplineModal
                open={viewCreateModal}
                onClose={handleClose}
                form={form}
                onFormChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                isValid={isValid}
                schoolLevelOptions={schoolLevelOptions}
                loadingSchoolLevels={loadingSchoolLevels}
            />
        </>
    );
};

export default ClassroomsPage;
