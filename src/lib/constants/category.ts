// Categoria de um sinal (substitui a antiga classe gramatical, agora criável pelo educador)
export interface CategorySlim {
    id: string;
    name: string;
    value: string;
}

// Como as categorias são dinâmicas, a cor do badge é derivada de forma determinística
// do value — mesma categoria sempre com a mesma cor.
const PALETTE = [
    "bg-lime-100 text-lime-700",
    "bg-sky-100 text-sky-700",
    "bg-campfire-100 text-campfire-700",
    "bg-salmon-100 text-salmon-700",
    "bg-sunflower-100 text-sunflower-700",
    "bg-cloud-200 text-cloud-600",
];

export function getCategoryBadgeClass(value?: string | null): string {
    if (!value) return PALETTE[PALETTE.length - 1];
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return PALETTE[hash % PALETTE.length];
}
