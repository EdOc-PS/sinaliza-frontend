// Disciplina Contexto — propostas e exemplos de redação
export const ESSAYS = {
    PROMPTS:        (disciplineId: string) => `disciplines/${disciplineId}/essay-prompts`,
    CREATE_PROMPT:  (disciplineId: string) => `disciplines/${disciplineId}/essay-prompts`,
    UPDATE_PROMPT:  (id: string) => `essay-prompts/${id}`,
    DELETE_PROMPT:  (id: string) => `essay-prompts/${id}`,
    COMPLETE:       (id: string) => `essay-prompts/${id}/complete`,

    EXAMPLES:       (disciplineId: string) => `disciplines/${disciplineId}/essay-examples`,
    CREATE_EXAMPLE: (disciplineId: string) => `disciplines/${disciplineId}/essay-examples`,
    DELETE_EXAMPLE: (id: string) => `essay-examples/${id}`,
}
