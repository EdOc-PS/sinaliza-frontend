// Disciplina fixa do glossário global (criada pelo gestor)
export interface GlossaryDisciplineSlim {
    id: string;
    name: string;
    description?: string | null;
    _count?: { signs: number };
}

// Cor determinística do card a partir do id (mesma disciplina, mesma cor)
const CARD_COLORS = ["#56B2D4", "#BACA57", "#E6AB6E", "#EEA2A2", "#EFB832", "#213547"];

export function getGlossaryDisciplineColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return CARD_COLORS[hash % CARD_COLORS.length];
}
