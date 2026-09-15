import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import Spinner from "@components/ui/Spinner";

import { Book01Icon, TextSelectIcon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CLASSROOMS } from "@routes/classrooms";
import { GetRequest, PatchRequest, PostRequest } from "@requests";

import { toast } from "sonner";

import type { CreateClassroomForm } from "@pages/classrooms";
import ModalStickyHeader from "@components/ui/Modal/StickyHeader";

export const PRESET_COLORS = [
    { hex: "#BACA57", label: "Lime" },
    { hex: "#56B2D4", label: "Sky" },
    { hex: "#E6AB6E", label: "Campfire" },
    { hex: "#EEA2A2", label: "Salmon" },
    { hex: "#213547", label: "Cloud" },
];

const EMPTY_FORM: CreateClassroomForm = {
    name: "",
    description: "",
    colorBackground: PRESET_COLORS[0].hex,
};

interface ClassroomFormProps {
    classroomId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const ClassroomForm = ({ classroomId, onClose, onSuccess }: ClassroomFormProps) => {
    const isEditMode = !!classroomId;

    const [form, setForm] = useState<CreateClassroomForm>(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    // Modo edição: busca a turma para pré-preencher o formulário
    const { data: classroom, isPending: loadingClassroom, isError: classroomError } = useQuery({
        queryKey: queryKeys.classrooms.detail(classroomId ?? ""),
        queryFn: () => unwrap(GetRequest<any>(CLASSROOMS.FIND_ONE(classroomId!))),
        enabled: !!classroomId,
        meta: { errorMessage: "Falha ao carregar turma" },
    });
    const loadingData = !!classroomId && loadingClassroom;

    // Sem a turma não há o que editar — fecha o modal (o toast vem do QueryCache)
    useEffect(() => {
        if (classroomError) onClose();
    }, [classroomError, onClose]);

    // Copia a turma carregada para o estado do formulário
    useEffect(() => {
        if (!classroom) return;
        setForm({
            name: classroom.name ?? "",
            description: classroom.description ?? "",
            colorBackground: classroom.colorBackground ?? PRESET_COLORS[0].hex,
        });
    }, [classroom]);

    const handleChange = (field: keyof CreateClassroomForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!form.name?.trim()) return;

        setLoading(true);
        try {
            const response = isEditMode
                ? await PatchRequest<CreateClassroomForm>(CLASSROOMS.UPDATE(classroomId!), form)
                : await PostRequest<CreateClassroomForm>(CLASSROOMS.CREATE(), form);

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
                <Spinner size={32} color="#6B7280" />
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
                        : "Defina o nome da turma. Um código de convite de 6 dígitos será gerado automaticamente."}
                </p>
            </div>
            </ModalStickyHeader>

            {/* Nome da turma */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="classroom-name" isRequired>Nome da turma</Label>
                <Input
                    id="classroom-name"
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
                <Label htmlFor="classroom-description" isOptional>Descrição</Label>
                <Input
                    id="classroom-description"
                    icon={TextSelectIcon}
                    placeholder="Ex: Turma de Libras para iniciantes"
                    value={form.description}
                    onChange={(v) => handleChange("description", v)}
                />
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
