export const DISCIPLINES = {
    OPTIONS:  ()           => `disciplines/options`,
    CREATE:   ()           => `disciplines`,
    MINE:     ()           => `disciplines/mine`,
    ENROLLED: ()           => `disciplines/enrolled`,
    JOIN:     ()           => `disciplines/join`,
    FIND_ONE: (id: string) => `disciplines/${id}`,
    UPDATE:   (id: string) => `disciplines/${id}`,
    DELETE:   (id: string) => `disciplines/${id}`,
}
