import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";


import { Book01Icon, TextSelectIcon, Calendar01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

import type { GenericOption } from "@interfaces";
import { DISCIPLINES } from "@routes/disciplines";
import { GetRequest } from "@requests";

import { toast } from "sonner";

import type { CreateDisciplineForm } from "@pages/classrooms";


interface CreateDisciplineModalProps {
    onClose: () => void;
    form: CreateDisciplineForm;
    onFormChange: (field: keyof CreateDisciplineForm, value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    loading: boolean;
    isValid: boolean;
}

// ── Cores predefinidas para a turma ──────────────────────────────────
export const PRESET_COLORS = [
    { hex: "#BACA57", label: "Lime" },
    { hex: "#56B2D4", label: "Sky" },
    { hex: "#E6AB6E", label: "Campfire" },
    { hex: "#EEA2A2", label: "Salmon" },
    { hex: "#213547", label: "Cloud" },
];

export const CreateDiscipline = ({
    onClose,
    form,
    onFormChange,
    onSubmit,
    loading,
    isValid,
}: CreateDisciplineModalProps) => {

    const [schoolLevelOptions, setSchoolLevelOptions] = useState<GenericOption[]>([]);
    const [loadingSchoolLevels, setLoadingSchoolLevels] = useState<boolean>(false);
    
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

    useEffect(() => {
        fetchSchoolLevels();
    }, []);

    return (
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
            <div className="grid grid-cols-3 gap-3">
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

                <div className="flex flex-col gap-1.5 col-span-2">
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
    );
}