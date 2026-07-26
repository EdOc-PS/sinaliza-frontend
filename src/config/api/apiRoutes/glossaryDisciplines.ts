// Disciplinas fixas do glossário global (criadas pelo gestor)
export const GLOSSARY_DISCIPLINES = {
    LIST:   () => `glossary-discipline`,
    CREATE: () => `glossary-discipline`,
    UPDATE: (id: string) => `glossary-discipline/${id}`,
    DELETE: (id: string) => `glossary-discipline/${id}`,
}
