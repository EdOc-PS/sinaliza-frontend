import { HugeiconsIcon } from "@hugeicons/react";
import { Tick04Icon } from "@hugeicons/core-free-icons";

import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { getGlossaryDisciplineColor, type GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

interface GlossaryDisciplineCardProps {
    discipline: GlossaryDisciplineSlim;
    selected: boolean;
    onToggle: () => void;
    /** Pool de ícones do confete do fundo */
    icons?: Parameters<typeof CardMemphisBackground>[0]["icons"];
    /** Versão menor (altura/padding/texto reduzidos) — usada no dropdown de busca */
    compact?: boolean;
}

// Card de disciplina do glossário — clicar filtra os sinais.
// Selecionado escurece o card inteiro e mostra um check por cima (mesmo padrão do teclado de mãos).
export const GlossaryDisciplineCard = ({
    discipline,
    selected,
    onToggle,
    icons,
    compact = false,
}: GlossaryDisciplineCardProps) => (
    <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={`relative overflow-hidden rounded-2xl text-left transition-transform duration-300 ease-out hover:-translate-y-0.5 ${compact ? "h-14" : "h-24"}`}
    >
        <CardMemphisBackground
            seed={discipline.id}
            color={getGlossaryDisciplineColor(discipline.id)}
            rounded="rounded-2xl"
            icons={icons}
        />

        <div className={`relative z-10 flex h-full flex-col justify-end ${compact ? "p-2" : "p-3"}`}>
            <span className={`truncate font-bold text-white ${compact ? "text-xs" : "text-sm"}`}>{discipline.name}</span>
            {!compact && <span className="text-xs text-white/80">{discipline._count?.signs ?? 0} sinais</span>}
        </div>

        {selected && (
            <span className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <HugeiconsIcon icon={Tick04Icon} size={compact ? 18 : 28} strokeWidth={2} className="text-white drop-shadow" />
            </span>
        )}
    </button>
);

export default GlossaryDisciplineCard;
