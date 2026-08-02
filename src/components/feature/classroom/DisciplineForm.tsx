import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import Spinner from "@components/ui/Spinner";

import { Book01Icon, TextSelectIcon, Calendar01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

import type { GenericOption } from "@interfaces";
import { DISCIPLINES } from "@routes/disciplines";
import { GetRequest, PatchRequest, PostRequest } from "@requests";

import { toast } from "sonner";

import type { CreateDisciplineForm } from "@pages/classrooms";
import ModalStickyHeader from "@components/ui/Modal/StickyHeader";

export const PRESET_COLORS = [
    { hex: "#BACA57", label: "Lime" },
    { hex: "#56B2D4", label: "Sky" },
    { hex: "#E6AB6E", label: "Campfire" },
    { hex: "#EEA2A2", label: "Salmon" },
    { hex: "#213547", label: "Cloud" },
];

const EMPTY_FORM: CreateDisciplineForm = {
    name: "",
    description: "",
    colorBackground: PRESET_COLORS[0].hex,
    schoolYear: Number(new Date().getFullYear()),
    schoolLevel: undefined,
};

interface DisciplineFormProps {
    disciplineId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const DisciplineForm = ({ disciplineId, onClose, onSuccess }: DisciplineFormProps) => {
    const isEditMode = !!disciplineId;

    const [form, setForm] = useState<CreateDisciplineForm>(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [schoolLevelOptions, setSchoolLevelOptions] = useState<GenericOption[]>([]);
    const [loadingSchoolLevels, setLoadingSchoolLevels] = useState(false);

    const fetchSchoolLevels = async () => {
        setLoadingSchoolLevels(true);
        try {
            const response = await GetRequest<GenericOption[]>(DISCIPLINES.OPTIONS());
            if (!response.success) toast.error("Falha ao obter níveis escolares: " + response.message);
            setSchoolLevelOptions(response.object || []);
        } finally {
            setLoadingSchoolLevels(false);
        }
    };

    const fetchDiscipline = async (disciplineId: string) => {
        setLoadingData(true);
        try {
            const response = await GetRequest<any>(DISCIPLINES.FIND_ONE(disciplineId));
            if (!response.success || !response.object) {
                toast.error("Falha ao carregar turma: " + response.message);
                onClose();
                return;
            }
            const d = response.object;
            setForm({
                name: d.name ?? "",
                description: d.description ?? "",
                colorBackground: d.colorBackground ?? PRESET_COLORS[0].hex,
                schoolYear: d.schoolYear ?? Number(new Date().getFullYear()),
                schoolLevel: d.schoolLevel ?? undefined,
            });
        } finally {
            setLoadingData(false);
        }
    };

    // Busca dados da disciplina para pré-preencher o form no modo edição
    useEffect(() => {
        if (!disciplineId) return;
        fetchDiscipline(disciplineId);
    }, [disciplineId]);

    // Busca opções de nível escolar
    useEffect(() => {

        fetchSchoolLevels();
    }, []);

    const handleChange = (field: keyof CreateDisciplineForm, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: field === "schoolYear" ? (value ? Number(value) : Number(new Date().getFullYear())) : value,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!form.name?.trim()) return;

        setLoading(true);
        try {
            const response = isEditMode
                ? await PatchRequest<CreateDisciplineForm>(DISCIPLINES.UPDATE(disciplineId!), form)
                : await PostRequest<CreateDisciplineForm>(DISCIPLINES.CREATE(), form);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(isEditMode ? "Turma atualizada com sucesso!" : "Turma criada com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const isValid = (form.name?.trim()?.length ?? 0) >= 3;

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-16">
                <Spinner size={32} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Cabeçalho */}
            <ModalStickyHeader>
                <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                    {isEditMode ? "Editar turma" : "Criar nova turma"}
                </h2>
                <p className="text-sm text-cloud-400 leading-snug">
                    {isEditMode
                        ? "Atualize as informações da turma abaixo."
                        : "Defina o nome da disciplina. Um código de convite de 6 dígitos será gerado automaticamente."}
                </p>
            </div>
            </ModalStickyHeader>

            {/* Nome da turma */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="discipline-name" isRequired>Nome da turma</Label>
                <Input
                    id="discipline-name"
                    icon={Book01Icon}
                    placeholder="Ex: Libras Básico"
                    value={form.name}
                    onChange={(v) => handleChange("name", v)}
                    noSpecialChars
                    autoFocus
                />
                {form.name.trim() !== "" && (form.name.trim().length < 3) ? (
                    <p className="text-xs text-neutral-400 pl-1">
                        O nome precisa ter pelo menos 3 caracteres.
                    </p>
                ) : (
                    <p className="text-xs text-cloud-400 pl-1">
                        Use um nome claro que ajude os alunos a identificar.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="discipline-description" isOptional>Descrição</Label>
                <Input
                    id="discipline-description"
                    icon={TextSelectIcon}
                    placeholder="Ex: Turma de Libras para iniciantes"
                    value={form.description}
                    onChange={(v) => handleChange("description", v)}
                />
            </div>

            {/* Ano e Nível escolar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="school-year" isOptional>Ano letivo</Label>
                    <Input
                        id="school-year"
                        icon={Calendar01Icon}
                        type="number"
                        placeholder="Ex: 2026"
                        value={form.schoolYear}
                        onChange={(v) => handleChange("schoolYear", v)}
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="school-level" isOptional>Nível escolar</Label>
                    <Select
                        id="school-level"
                        icon={Layers01Icon}
                        placeholder={loadingSchoolLevels ? "Carregando..." : "Selecione"}
                        options={schoolLevelOptions}
                        value={form.schoolLevel}
                        onChange={(v) => handleChange("schoolLevel", v)}
                        disabled={loadingSchoolLevels}
                    />
                </div>
            </div>

            {/* Cor de identificação */}
            <div className="flex flex-col gap-2.5">
                <Label isRequired>Cor de identificação</Label>
                <div className="flex items-center gap-3">
                    {PRESET_COLORS.map(({ hex, label }) => (
                        <button
                            key={hex}
                            type="button"
                            title={label}
                            onClick={() => handleChange("colorBackground", hex)}
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
            <div className="flex gap-3 pt-1 justify-end">
                <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="cloud"
                    className="w-3/5"
                    disabled={!isValid}
                    loading={loading}
                    loadingText={isEditMode ? "Salvando..." : "Criando..."}
                >
                    {isEditMode ? "Salvar alterações" : "Criar turma"}
                </Button>
            </div>
        </form>
    );
};
