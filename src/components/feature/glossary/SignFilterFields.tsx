import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { MortarboardIcon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import HandConfigPicker, { type HandConfig } from "@components/feature/workspace/HandConfigPicker";
import { GlossaryDisciplineCard } from "./GlossaryDisciplineCard";

const chipClass = (active: boolean) =>
    `rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-campfire-100 text-campfire-600" : "bg-cloud-100 text-cloud-500 hover:bg-cloud-200"
    }`;

// Mesma grade do teclado visual do Ambiente de Trabalho: 9 colunas, 2 linhas por página
const HAND_CONFIG_GRID = "grid grid-cols-9 gap-1.5";
const HAND_CONFIG_ITEMS_PER_PAGE = 18;

interface SignFilterFieldsProps {
    categories: CategorySlim[];
    categoryId: string;
    onCategoryChange: (id: string) => void;

    handConfigId: string;
    onHandConfigChange: (id: string) => void;
    /** Configurações já carregadas — usado no glossário público, cujo endpoint de mãos exige token */
    handConfigs?: HandConfig[];

    disciplines: GlossaryDisciplineSlim[];
    glossaryDisciplineId: string;
    onDisciplineChange: (id: string) => void;
    /** Pool de ícones do confete dos cards de disciplina */
    disciplineIcons?: IconSvgElement[];
    /** Cards de disciplina menores — usado no dropdown de busca */
    disciplineCompact?: boolean;
}

// Blocos de filtro (categoria, configuração de mão, disciplina) compartilhados
// entre o GlossaryFilters e o dropdown do TopSearchBar — mesmo componente,
// mesmo visual, em vez de duas implementações divergentes.
export const SignFilterFields = ({
    categories,
    categoryId,
    onCategoryChange,
    handConfigId,
    onHandConfigChange,
    handConfigs,
    disciplines,
    glossaryDisciplineId,
    onDisciplineChange,
    disciplineIcons,
    disciplineCompact = false,
}: SignFilterFieldsProps) => (
    <div className="flex flex-col gap-5">
        {/* Categorias */}
        {categories.length > 0 && (
            <div className="flex flex-col gap-2">
                <span className="px-1 text-sm font-semibold text-cloud-500">Categorias</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onCategoryChange("")}
                        className={chipClass(categoryId === "")}
                    >
                        Todas
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => onCategoryChange(categoryId === c.id ? "" : c.id)}
                            className={chipClass(categoryId === c.id)}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Teclado de configuração de mão */}
        <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
                <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                Configuração de mão
            </span>
            <HandConfigPicker
                value={handConfigId}
                onChange={onHandConfigChange}
                configs={handConfigs}
                compact
                allowDeselect
                gridClassName={HAND_CONFIG_GRID}
                itemsPerPage={HAND_CONFIG_ITEMS_PER_PAGE}
            />
        </div>

        {/* Disciplinas do glossário */}
        {disciplines.length > 0 && (
            <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
                    <HugeiconsIcon icon={MortarboardIcon} size={18} />
                    Disciplinas
                </span>
                <div className={`stagger-children grid gap-3 ${disciplineCompact ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
                    {disciplines.map((disc) => (
                        <GlossaryDisciplineCard
                            key={disc.id}
                            discipline={disc}
                            selected={glossaryDisciplineId === disc.id}
                            onToggle={() =>
                                onDisciplineChange(glossaryDisciplineId === disc.id ? "" : disc.id)
                            }
                            icons={disciplineIcons}
                            compact={disciplineCompact}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default SignFilterFields;
