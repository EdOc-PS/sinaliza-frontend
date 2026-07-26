export const SIGNS = {
    OPTIONS:  ()           => `sign/options`,
    CREATE:   ()           => `sign`,
    FIND_ALL: ()           => `sign`,
    FIND_ONE: (id: string) => `sign/${id}`,
    UPDATE:   (id: string) => `sign/${id}`,
    DELETE:   (id: string) => `sign/${id}`,
    PROMOTE:          (id: string) => `sign/${id}/promote`,
    PROMOTIONS:       ()           => `sign/promotions`,
    REVIEW_PROMOTION: (id: string) => `sign/${id}/promotion`,
}

// Glossário global — endpoints públicos (sem autenticação)
export const GLOSSARY = {
    LIST:    () => `glossary`,
    FILTERS: () => `glossary/filters`,
}
