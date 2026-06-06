export const FAVORITES = {
    ADD:    (signId: string) => `favorite/${signId}`,
    REMOVE: (signId: string) => `favorite/${signId}`,
    ALL:    ()               => `favorite`,
}
