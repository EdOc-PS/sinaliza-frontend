export const CLASSROOMS = {
    CREATE:   ()           => `classrooms`,
    MINE:     ()           => `classrooms/mine`,
    JOIN:     ()           => `classrooms/join`,
    FIND_ONE: (id: string) => `classrooms/${id}`,
    SIGNS:           (id: string) => `classrooms/${id}/signs`,
    SIGNS_FAVORITES: (id: string) => `classrooms/${id}/signs/favorites`,
    MEMBERS:         (id: string) => `classrooms/${id}/members`,
    ADD_MEMBER:      (id: string) => `classrooms/${id}/members`,
    REMOVE_MEMBER:   (id: string, userId: string) => `classrooms/${id}/members/${userId}`,
    UPDATE:   (id: string) => `classrooms/${id}`,
    DELETE:   (id: string) => `classrooms/${id}`,
    LEAVE:    (id: string) => `classrooms/${id}/leave`,
}
