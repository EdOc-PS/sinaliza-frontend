// Extrai as iniciais de um nome (até 2 letras) — usado em avatares fallback
export const getInitials = (name: string): string =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
