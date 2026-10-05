import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { MortarboardIcon, SignLanguageCIcon, TagsIcon } from "@hugeicons/core-free-icons";

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

const toggleId = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

// Título de seção: ícone + texto + linha separadora ocupando o resto
const SectionTitle = ({ icon, children }: { icon: IconSvgElement; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 px-1 text-sm font-semibold text-cloud-500">
        <HugeiconsIcon icon={icon} size={18} />
        <span className="shrink-0">{children}</span>
        <span className="h-px flex-1 bg-cloud-200" aria-hidden />
    </div>
);

interface SignFilterFieldsProps {
    categories: CategorySlim[];
    categoryIds: string[];
    onCategoryIdsChange: (ids: string[]) => void;

    handConfigIds: string[];
    onHandConfigIdsChange: (ids: string[]) => void;
    /** Configurações já carregadas — usado no glossário público, cujo endpoint de mãos exige token */
    handConfigs?: HandConfig[];

    disciplines: GlossaryDisciplineSlim[];
    glossaryDisciplineIds: string[];
    onDisciplineIdsChange: (ids: string[]) => void;
    /** Pool de ícones do confete dos cards de disciplina */
    disciplineIcons?: IconSvgElement[];
}

// Blocos de filtro (categoria, configuração de mão, disciplina), todos com
// múltipla seleção. Usado pelo SignFiltersCard (glossários e busca em Turmas).
export const SignFilterFields = ({
    categories,
    categoryIds,
    onCategoryIdsChange,
    handConfigIds,
    onHandConfigIdsChange,
    handConfigs,
    disciplines,
    glossaryDisciplineIds,
    onDisciplineIdsChange,
    disciplineIcons,
}: SignFilterFieldsProps) => (
    <div className="flex flex-col gap-5">
        {/* Categorias */}
        {categories.length > 0 && (
            <div className="flex flex-col gap-2">
                <SectionTitle icon={TagsIcon}>Categorias</SectionTitle>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onCategoryIdsChange([])}
                        className={chipClass(categoryIds.length === 0)}
                    >
                        Todas
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            aria-pressed={categoryIds.includes(c.id)}
                            onClick={() => onCategoryIdsChange(toggleId(categoryIds, c.id))}
                            className={chipClass(categoryIds.includes(c.id))}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Teclado de configuração de mão */}
        <div className="flex flex-col gap-2">
            <SectionTitle icon={SignLanguageCIcon}>Configuração de mão</SectionTitle>
            <HandConfigPicker
                selectedIds={handConfigIds}
                onToggle={(id) => onHandConfigIdsChange(toggleId(handConfigIds, id))}
                configs={handConfigs}
                compact
                gridClassName={HAND_CONFIG_GRID}
                itemsPerPage={HAND_CONFIG_ITEMS_PER_PAGE}
            />
        </div>

        {/* Disciplinas do glossário */}
        {disciplines.length > 0 && (
            <div className="flex flex-col gap-2">
                <SectionTitle icon={MortarboardIcon}>Disciplinas</SectionTitle>
                <div className="stagger-children grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {disciplines.map((disc) => (
                        <GlossaryDisciplineCard
                            key={disc.id}
                            discipline={disc}
                            selected={glossaryDisciplineIds.includes(disc.id)}
                            onToggle={() => onDisciplineIdsChange(toggleId(glossaryDisciplineIds, disc.id))}
                            icons={disciplineIcons}
                            compact
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default SignFilterFields;
