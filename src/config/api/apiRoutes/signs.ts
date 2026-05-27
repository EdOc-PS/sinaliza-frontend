export const SIGNS = {
    OPTIONS:  ()           => `sign/options`,
    CREATE:   ()           => `sign`,
    FIND_ALL: ()           => `sign`,
    FIND_ONE: (id: string) => `sign/${id}`,
    UPDATE:   (id: string) => `sign/${id}`,
    DELETE:   (id: string) => `sign/${id}`,
}
