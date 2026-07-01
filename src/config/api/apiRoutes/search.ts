export const SEARCH = {
    SIGNS: () => `search/signs`,
    DISCIPLINE_SIGNS: (disciplineId: string) => `search/disciplines/${disciplineId}/signs`,
    RELATED: (signId: string) => `search/signs/${signId}/related`,
}
