import { useQueries } from "@tanstack/react-query";

import { GetRequest } from "@requests";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { CATEGORIES } from "@routes/categories";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { CategorySlim } from "@lib/constants/category";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

// Opções do card de filtros (área logada) — mudam pouco, por isso o staleTime alto
export const useSignFilterOptions = () => {
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
    return {
        categories: categoriesQuery.data ?? [],
        disciplines: disciplinesQuery.data ?? [],
    };
};
