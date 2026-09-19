import { useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
    ArrowDown01Icon,
    Cancel01Icon,
    FilterIcon,
    Search01Icon,
} from "@hugeicons/core-free-icons";

import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import Accordion from "@components/ui/Accordion";
import Input from "@components/ui/Input";
import type { HandConfig } from "@components/feature/workspace/HandConfigPicker";
import { SignFilterFields } from "./SignFilterFields";

interface GlossaryFiltersProps {
    query: string;
    onQueryChange: (value: string) => void;

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
    /** Fundo do campo de busca (o card é branco em ambas as telas) */
    searchWrapperClassName?: string;
    placeholder?: string;
}

// Card de filtros dos glossários (logado e público).
// Fica recolhido por padrão — expande ao clicar na busca ou no botão do canto superior esquerdo.
export const GlossaryFilters = ({
    query,
    onQueryChange,
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
    searchWrapperClassName,
    placeholder = "Buscar no glossário...",
}: GlossaryFiltersProps) => {
    const [open, setOpen] = useState(false);

    const activeCount =
        (categoryId ? 1 : 0) + (handConfigId ? 1 : 0) + (glossaryDisciplineId ? 1 : 0);

    const clearAll = () => {
        onCategoryChange("");
        onHandConfigChange("");
        onDisciplineChange("");
    };

    return (
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6">
            {/* Cabeçalho — o botão da esquerda abre/fecha */}
            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls="glossary-filters-content"
                    aria-label={open ? "Recolher filtros" : "Expandir filtros"}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-campfire-100 text-campfire-600 transition-colors duration-300 hover:bg-campfire-200"
                >
                    <HugeiconsIcon
                        icon={open ? ArrowDown01Icon : FilterIcon}
                        size={20}
                        className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                </button>

                <div className="min-w-0 flex-1">
                    <h2 className="font-baskerville text-lg font-bold text-cloud-600">Buscar sinais</h2>
                    <p className="truncate text-sm text-neutral-500">
                        Combine busca por palavra, categoria, configuração de mão e disciplina.
                    </p>
                </div>

                {/* Filtros ativos + limpar */}
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        title="Limpar filtros"
                        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-campfire-100 px-2.5 py-1.5 text-xs font-semibold text-campfire-600 transition-colors duration-200 hover:bg-campfire-200"
                    >
                        {activeCount} filtro{activeCount > 1 ? "s" : ""}
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                    </button>
                )}
            </div>

            {/* Busca textual — clicar/focar também expande */}
            <Input
                icon={Search01Icon}
                wrapperClassName={searchWrapperClassName}
                value={query}
                onChange={onQueryChange}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
            />

            {/* Acordeão */}
            <Accordion id="glossary-filters-content" open={open}>
                <div className="pt-1">
                    <SignFilterFields
                        categories={categories}
                        categoryId={categoryId}
                        onCategoryChange={onCategoryChange}
                        handConfigId={handConfigId}
                        onHandConfigChange={onHandConfigChange}
                        handConfigs={handConfigs}
                        disciplines={disciplines}
                        glossaryDisciplineId={glossaryDisciplineId}
                        onDisciplineChange={onDisciplineChange}
                        disciplineIcons={disciplineIcons}
                        disciplineCompact
                    />
                </div>
            </Accordion>
        </div>
    );
};

export default GlossaryFilters;
