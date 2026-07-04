export const USERS = {
    LIST: () => `users`,
    FIND_ONE: (id: string) => `users/${id}`,
    CREATE_EDUCATOR: () => `users/educator`,
    UPDATE: (id: string) => `users/${id}`,
    UPDATE_ROLES: (id: string) => `users/${id}/roles`,
}
