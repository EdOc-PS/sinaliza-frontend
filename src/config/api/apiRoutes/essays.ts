// Turma Contexto — propostas e exemplos de redação
export const ESSAYS = {
    PROMPTS:        (classroomId: string) => `classrooms/${classroomId}/essay-prompts`,
    CREATE_PROMPT:  (classroomId: string) => `classrooms/${classroomId}/essay-prompts`,
    UPDATE_PROMPT:  (id: string) => `essay-prompts/${id}`,
    DELETE_PROMPT:  (id: string) => `essay-prompts/${id}`,
    COMPLETE:       (id: string) => `essay-prompts/${id}/complete`,

    EXAMPLES:       (classroomId: string) => `classrooms/${classroomId}/essay-examples`,
    CREATE_EXAMPLE: (classroomId: string) => `classrooms/${classroomId}/essay-examples`,
    DELETE_EXAMPLE: (id: string) => `essay-examples/${id}`,
}
