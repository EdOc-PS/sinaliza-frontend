export const NOTIFICATIONS = {
    ALL:      ()           => `notifications`,
    READ_ALL: ()           => `notifications/read-all`,
    REMOVE:   (id: string) => `notifications/${id}`,
    PASSWORD_REQUESTS: ()   => `notifications/password-requests`,
    PASSWORD_REQUEST: (id: string) => `notifications/password-requests/${id}`,
}
