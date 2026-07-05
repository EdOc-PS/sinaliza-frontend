import {
    Backpack01Icon,
    ConversationIcon,
    DiplomaIcon,
    HealtcareIcon,
    HierarchyCircle02Icon,
    LocationUser01Icon,
    Mail01Icon,
    StationeryIcon,
    TeacherIcon,
} from "@hugeicons/core-free-icons";

import type { EducatorType, Role } from "@api/requests";

export type PerfilId = "student" | "educator" | "interpreter" | "guardian";

export type CampoFormulario = {
    id: string;
    label: string;
    placeholder?: string;
    icon?: typeof LocationUser01Icon;
    type?: string;
    kind?: "input" | "select";
    options?: Array<{ label: string; value: string }>;
    noSpecialChars?: boolean;
};

// Campos específicos de cada perfil — usados no cadastro e na edição de conta
export const PERFIL_FORMULARIOS: Record<
    PerfilId,
    { titulo: string; descricao: string; campos: CampoFormulario[] }
> = {
    student: {
        titulo: "Dados do estudante",
        descricao: "Complete as informações acadêmicas e de apoio.",
        campos: [
            {
                id: "grauEscolar",
                label: "Grau escolar:",
                placeholder: "Ex: 8º ano, ensino médio, graduação",
                icon: Backpack01Icon,
            },
            {
                id: "necessidadesEspeciais",
                label: "Necessidades especiais:",
                placeholder: "Descreva se houver alguma",
                icon: HealtcareIcon,
                noSpecialChars: true,
            },
        ],
    },
    educator: {
        titulo: "Dados do educador",
        descricao: "Informe a atuação acadêmica principal.",
        campos: [
            {
                id: "department",
                label: "Departamento:",
                placeholder: "Ex: Matemática, Pedagogia",
                icon: TeacherIcon,
                noSpecialChars: true,
            },
            {
                id: "specialty",
                label: "Especialidade:",
                placeholder: "Área de maior atuação",
                icon: StationeryIcon,
                noSpecialChars: true,
            },
        ],
    },
    interpreter: {
        titulo: "Dados do intérprete",
        descricao: "Detalhe a formação e a área de apoio.",
        campos: [
            {
                id: "proficienciaLibras",
                label: "Proficiência em Libras:",
                icon: ConversationIcon,
                kind: "select",
                options: [
                    { label: "Básico", value: "BASICO" },
                    { label: "Intermediário", value: "INTERMEDIARIO" },
                    { label: "Avançado", value: "AVANCADO" },
                    { label: "Fluente", value: "FLUENTE" },
                ],
            },
            {
                id: "certificate",
                label: "Certificado:",
                placeholder: "Informação sobre certificação",
                icon: DiplomaIcon,
                noSpecialChars: true,
            },
            {
                id: "areaAtuacao",
                label: "Área de atuação:",
                placeholder: "Ex: reforço escolar, interpretação",
                icon: TeacherIcon,
                noSpecialChars: true,
            },
        ],
    },
    guardian: {
        titulo: "Dados do responsável",
        descricao: "Preencha as informações de vínculo.",
        campos: [
            {
                id: "studentEmail",
                label: "Email do aluno:",
                placeholder: "aluno@email.com",
                icon: Mail01Icon,
            },
            {
                id: "parentesco",
                label: "Parentesco:",
                placeholder: "Ex: mãe, pai, avó",
                icon: HierarchyCircle02Icon,
                noSpecialChars: true,
            },
        ],
    },
};

// Mapeia roles + educatorType (Educador/Intérprete são a mesma role) para o perfil de campos correspondente.
// Como um usuário pode ter múltiplas roles, usa a de maior prioridade para o formulário de perfil.
export const getPerfilId = (roles: Role[], educatorType?: EducatorType | null): PerfilId | null => {
    if (roles.includes("EDUCATOR")) return educatorType === "INTERPRETER" ? "interpreter" : "educator";
    if (roles.includes("GUARDIAN")) return "guardian";
    if (roles.includes("STUDENT")) return "student";
    return null;
};
