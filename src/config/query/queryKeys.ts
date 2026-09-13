/**
 * Chaves de cache centralizadas.
 *
 * Manter tudo aqui evita o erro mais comum do TanStack Query: escrever a chave
 * na mão em dois lugares, com uma diferença mínima, e a invalidação após um
 * POST silenciosamente não atualizar a listagem.
 *
 * A hierarquia importa. `invalidateQueries({ queryKey: queryKeys.classrooms.all })`
 * invalida a lista E os detalhes, porque toda chave de turma começa
 * com `["classrooms"]`.
 */
export const queryKeys = {
    classrooms: {
        all: ["classrooms"] as const,
        mine: () => ["classrooms", "mine"] as const,
        detail: (id: string) => ["classrooms", "detail", id] as const,
        signs: (id: string) => ["classrooms", id, "signs"] as const,
        signsFavorites: (id: string) => ["classrooms", id, "signs", "favorites"] as const,
        members: (id: string) => ["classrooms", id, "members"] as const,
    },
    search: {
        all: ["search"] as const,
        signs: (f: { search?: string; handConfigId?: string; categoryId?: string }) =>
            ["search", "signs", f.search ?? "", f.handConfigId ?? "", f.categoryId ?? ""] as const,
    },
    signs: {
        all: ["signs"] as const,
        detail: (id: string) => ["signs", "detail", id] as const,
        related: (id: string) => ["signs", "related", id] as const,
        options: () => ["signs", "options"] as const,
        promotions: () => ["signs", "promotions"] as const,
    },
    handConfigs: {
        all: ["hand-configs"] as const,
        list: (search?: string) => ["hand-configs", "list", search ?? ""] as const,
    },
    categories: {
        all: ["categories"] as const,
        list: () => ["categories", "list"] as const,
    },
    glossaryDisciplines: {
        all: ["glossary-disciplines"] as const,
        list: () => ["glossary-disciplines", "list"] as const,
    },
    glossary: {
        all: ["glossary"] as const,
        filters: () => ["glossary", "filters"] as const,
        // Os filtros entram na chave: mudar um deles é outro cache e o
        // TanStack Query refaz o fetch sozinho, sem useEffect observando.
        list: (filters: { categoryId?: string; handConfigId?: string; glossaryDisciplineId?: string }) =>
            [
                "glossary",
                "list",
                filters.categoryId ?? "",
                filters.handConfigId ?? "",
                filters.glossaryDisciplineId ?? "",
            ] as const,
    },
    favorites: {
        all: ["favorites"] as const,
        list: () => ["favorites", "list"] as const,
    },
    history: {
        all: ["history"] as const,
        list: () => ["history", "list"] as const,
    },
    essays: {
        all: ["essays"] as const,
        prompts: (classroomId: string) => ["essays", "prompts", classroomId] as const,
        examples: (classroomId: string) => ["essays", "examples", classroomId] as const,
    },
    users: {
        all: ["users"] as const,
        educators: (search?: string) => ["users", "educators", search ?? ""] as const,
        detail: (id: string) => ["users", "detail", id] as const,
        members: (role: string, search?: string) => ["users", "members", role, search ?? ""] as const,
    },
} as const;
