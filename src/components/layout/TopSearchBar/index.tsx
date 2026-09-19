import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search01Icon } from "@hugeicons/core-free-icons";

import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { SignFilterFields } from "@components/feature/glossary/SignFilterFields";
import { useQueries } from "@tanstack/react-query";
import { GetRequest } from "@requests";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { CATEGORIES } from "@routes/categories";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

interface TopSearchBarProps {
    /** Controlado pelo pai (ex: ícone de busca no header mobile). Sem isso, usa estado interno. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const TopSearchBar = ({ open: openProp, onOpenChange }: TopSearchBarProps) => {
    const navigate = useNavigate();
    const rootRef = useRef<HTMLDivElement>(null);

    const [openState, setOpenState] = useState(false);
    const open = openProp ?? openState;
    const setOpen = onOpenChange ?? setOpenState;

    const [search, setSearch] = useState("");
    const [handConfigId, setHandConfigId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [glossaryDisciplineId, setGlossaryDisciplineId] = useState("");

    const [categoriesQuery, disciplinesQuery] = useQueries({
        queries: [
            {
                queryKey: queryKeys.categories.list(),
                queryFn: () => unwrap(GetRequest<CategorySlim[]>(CATEGORIES.LIST())),
                staleTime: 30 * 60_000,
            },
            {
                queryKey: queryKeys.glossaryDisciplines.list(),
                queryFn: () => unwrap(GetRequest<GlossaryDisciplineSlim[]>(GLOSSARY_DISCIPLINES.LIST())),
                staleTime: 30 * 60_000,
            },
        ],
    });
    const categories = categoriesQuery.data ?? [];
    const disciplines = disciplinesQuery.data ?? [];

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [setOpen]);

    const submit = () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (handConfigId) params.set("handConfigId", handConfigId);
        if (categoryId) params.set("categoryId", categoryId);
        if (glossaryDisciplineId) params.set("glossaryDisciplineId", glossaryDisciplineId);
        setOpen(false);
        navigate(`/search?${params.toString()}`);
    };

    const activeFilters = (handConfigId ? 1 : 0) + (categoryId ? 1 : 0) + (glossaryDisciplineId ? 1 : 0);

    return (
        <div ref={rootRef} className="relative">
            {/* Campo de texto — só no desktop; no mobile a busca abre pelo ícone do header */}
            <div className="relative hidden lg:block">
                <Input
                    icon={Search01Icon}
                    wrapperClassName="bg-white"
                    value={search}
                    onChange={(value) => setSearch(value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                    placeholder="Buscar sinal..."
                />
                {activeFilters > 0 && (
                    <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg bg-campfire-100 px-2 py-0.5 text-xs font-semibold text-campfire-600 sm:flex">
                        {activeFilters} filtro{activeFilters > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Dropdown com busca (mobile), categoria, teclado de mão e disciplina */}
            {open && (
                <div className="dropdown-slide absolute left-0 right-0 top-full z-40 mt-2 flex flex-col gap-5 rounded-3xl border-2 border-cloud-400/10 bg-white p-4 shadow-xl">
                    {/* Campo de texto — só no mobile, já que o de cima fica escondido */}
                    <div className="lg:hidden">
                        <Input
                            icon={Search01Icon}
                            value={search}
                            onChange={(value) => setSearch(value)}
                            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                            placeholder="Buscar sinal..."
                            autoFocus
                        />
                    </div>

                    <SignFilterFields
                        categories={categories}
                        categoryId={categoryId}
                        onCategoryChange={setCategoryId}
                        handConfigId={handConfigId}
                        onHandConfigChange={setHandConfigId}
                        disciplines={disciplines}
                        glossaryDisciplineId={glossaryDisciplineId}
                        onDisciplineChange={setGlossaryDisciplineId}
                        disciplineCompact
                    />

                    <Button type="button" variant="cloud" className="w-full" onClick={submit}>
                        Buscar
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TopSearchBar;
