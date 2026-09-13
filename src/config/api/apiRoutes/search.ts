export const SEARCH = {
    SIGNS: () => `search/signs`,
    CLASSROOM_SIGNS: (classroomId: string) => `search/classrooms/${classroomId}/signs`,
    RELATED: (signId: string) => `search/signs/${signId}/related`,
}
