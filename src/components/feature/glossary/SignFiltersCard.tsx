import { useEffect, useState, type RefObject } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowDown01Icon, FilterIcon, FilterRemoveIcon, Search01Icon } from "@hugeicons/core-free-icons";

import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import Accordion from "@components/ui/Accordion";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import type { HandConfig } from "@components/feature/workspace/HandConfigPicker";
import { SignFilterFields } from "./SignFilterFields";

export interface SignFilters {
    query: string;
    categoryIds: string[];
    handConfigIds: string[];
    glossaryDisciplineIds: string[];
}

export const EMPTY_SIGN_FILTERS: SignFilters = {
    query: "",
    categoryIds: [],
    handConfigIds: [],
    glossaryDisciplineIds: [],
};

export const countActiveFilters = (f: SignFilters) =>
    f.categoryIds.length + f.handConfigIds.length + f.glossaryDisciplineIds.length;

/** Filtros → query string da API/URL (listas viram ids separadas por vírgula) */
export const filtersToParams = (f: SignFilters): Record<string, string> => {
    const params: Record<string, string> = {};
    if (f.query.trim()) params.search = f.query.trim();
    if (f.categoryIds.length) params.categoryId = f.categoryIds.join(",");
    if (f.handConfigIds.length) params.handConfigId = f.handConfigIds.join(",");
    if (f.glossaryDisciplineIds.length) params.glossaryDisciplineId = f.glossaryDisciplineIds.join(",");
    return params;
};

/** Caminho inverso: lê os filtros da URL (página de resultados da busca) */
export const filtersFromParams = (params: URLSearchParams): SignFilters => {
    const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);
    return {
        query: params.get("search") ?? "",
        categoryIds: list("categoryId"),
        handConfigIds: list("handConfigId"),
        glossaryDisciplineIds: list("glossaryDisciplineId"),
    };
};

interface SignFiltersCardProps {
    /** Filtros já aplicados — o card edita um rascunho e só devolve ao clicar em Pesquisar */
    value: SignFilters;
    onApply: (filters: SignFilters) => void;

    categories: CategorySlim[];
    disciplines: GlossaryDisciplineSlim[];
    /** Configurações já carregadas — usado no glossário público, cujo endpoint de mãos exige token */
    handConfigs?: HandConfig[];
    disciplineIcons?: IconSvgElement[];

    title?: string;
    subtitle?: string;
    placeholder?: string;
    /** Fundo do campo de busca (o card é branco em ambas as telas) */
    searchWrapperClassName?: string;
    defaultOpen?: boolean;
    /** Área de resultados — ao pesquisar, a tela desliza até ela */
    resultsRef?: RefObject<HTMLElement | null>;
}

// Card de busca de sinais usado no glossário (logado e público) e em Turmas.
// Os filtros são escolhidos num rascunho e só valem ao clicar em "Pesquisar"
// (ou Enter na busca); "Limpar" zera tudo e já aplica.
export const SignFiltersCard = ({
    value,
    onApply,
    categories,
    disciplines,
    handConfigs,
    disciplineIcons,
    title = "Buscar sinais",
    subtitle = "Combine busca por palavra, categoria, configuração de mão e disciplina.",
    placeholder = "Buscar sinal...",
    searchWrapperClassName,
    defaultOpen = false,
    resultsRef,
}: SignFiltersCardProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const [draft, setDraft] = useState<SignFilters>(value);

    // Quando os filtros aplicados mudam de fora (ex: URL), o rascunho acompanha
    useEffect(() => {
        setDraft(value);
    }, [value]);

    const appliedCount = countActiveFilters(value);
    const draftCount = countActiveFilters(draft);
    const hasAnything = draftCount > 0 || !!draft.query.trim() || appliedCount > 0 || !!value.query.trim();

    // Sem texto nem filtro no rascunho, Pesquisar fica desabilitado
    const canSearch = draftCount > 0 || !!draft.query.trim();

    // Depois de pesquisar, desliza até os resultados (quando a tela informa onde ficam)
    const scrollToResults = () =>
        requestAnimationFrame(() => resultsRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

    const apply = () => {
        if (!canSearch) return;
        onApply(draft);
        scrollToResults();
    };
    const clear = () => {
        setDraft(EMPTY_SIGN_FILTERS);
        onApply(EMPTY_SIGN_FILTERS);
    };

    return (
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6">
            {/* Cabeçalho — o botão da esquerda abre/fecha os filtros */}
            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-controls="sign-filters-content"
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
                    <h2 className="font-baskerville text-lg font-bold text-cloud-600">{title}</h2>
                    <p className="truncate text-sm text-neutral-500">{subtitle}</p>
                </div>

                {/* Limpar fica no cabeçalho, só quando há algo para limpar */}
                {hasAnything && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={FilterRemoveIcon}
                        iconSize={16}
                        onClick={clear}
                        className="shrink-0"
                    >
                        Limpar{appliedCount > 0 ? ` (${appliedCount})` : ""}
                    </Button>
                )}
            </div>

            {/* Busca textual — focar abre os filtros; Enter pesquisa */}
            <Input
                icon={Search01Icon}
                wrapperClassName={searchWrapperClassName}
                value={draft.query}
                onChange={(query) => setDraft((d) => ({ ...d, query }))}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
                placeholder={placeholder}
            />

            <Accordion id="sign-filters-content" open={open}>
                <div className="pt-1">
                    <SignFilterFields
                        categories={categories}
                        categoryIds={draft.categoryIds}
                        onCategoryIdsChange={(categoryIds) => setDraft((d) => ({ ...d, categoryIds }))}
                        handConfigIds={draft.handConfigIds}
                        onHandConfigIdsChange={(handConfigIds) => setDraft((d) => ({ ...d, handConfigIds }))}
                        handConfigs={handConfigs}
                        disciplines={disciplines}
                        glossaryDisciplineIds={draft.glossaryDisciplineIds}
                        onDisciplineIdsChange={(glossaryDisciplineIds) => setDraft((d) => ({ ...d, glossaryDisciplineIds }))}
                        disciplineIcons={disciplineIcons}
                    />
                </div>
            </Accordion>

            <Button type="button" size="sm" icon={Search01Icon} onClick={apply} disabled={!canSearch} className="w-full disabled:cursor-not-allowed disabled:opacity-50">
                Pesquisar{draftCount > 0 ? ` (${draftCount})` : ""}
            </Button>
        </div>
    );
};

export default SignFiltersCard;
