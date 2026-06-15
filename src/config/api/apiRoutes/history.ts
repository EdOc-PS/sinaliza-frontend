export const HISTORY = {
    ALL:      ()               => `history`,
    REGISTER: (signId: string) => `history/${signId}`,
    REMOVE:   (signId: string) => `history/${signId}`,
    CLEAR:    ()               => `history`,
}
