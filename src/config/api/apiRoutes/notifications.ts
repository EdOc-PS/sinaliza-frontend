export const NOTIFICATIONS = {
    ALL:      ()           => `notifications`,
    READ_ALL: ()           => `notifications/read-all`,
    REMOVE:   (id: string) => `notifications/${id}`,
}
