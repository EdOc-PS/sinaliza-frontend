export const DISCIPLINES = {
    OPTIONS:  ()           => `disciplines/options`,
    CREATE:   ()           => `disciplines`,
    MINE:     ()           => `disciplines/mine`,
    FIND_ONE: (id: string) => `disciplines/${id}`,
    UPDATE:   (id: string) => `disciplines/${id}`,
    DELETE:   (id: string) => `disciplines/${id}`,
}
