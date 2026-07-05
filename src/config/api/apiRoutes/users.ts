export const USERS = {
    LIST: () => `users`,
    EDUCATORS: () => `users/educators`,
    FIND_ONE: (id: string) => `users/${id}`,
    CREATE_EDUCATOR: () => `users/educator`,
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
    UPDATE_ROLES: (id: string) => `users/${id}/roles`,
}
