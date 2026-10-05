// Disciplina fixa do glossário global (criada pelo gestor)
export interface GlossaryDisciplineSlim {
    id: string;
    name: string;
    description?: string | null;
    _count?: { signs: number };
}

// Cor determinística do card a partir do id (mesma disciplina, mesma cor)
// Cores do tema + variações mais escuras e dois tons extras (lilás e verde-água)
// para disciplinas vizinhas não repetirem tanto a mesma cor
const CARD_COLORS = [
    "#56B2D4", "#BACA57", "#E6AB6E", "#EEA2A2", "#EFB832", "#213547",
    "#3E8FB0", "#8FA03A", "#C9874A", "#D97B7B", "#C99A1F", "#4A6A85",
    "#9B86C9", "#5FB89A",
];

export function getGlossaryDisciplineColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return CARD_COLORS[hash % CARD_COLORS.length];
}
