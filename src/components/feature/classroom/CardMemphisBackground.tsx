import { HugeiconsIcon } from "@hugeicons/react";
import {
    BookIcon, BooksIcon, MortarboardIcon, CertificateIcon,
    CompassIcon, PencilRulerIcon, AbacusIcon, CalculatorIcon,
    AtomIcon, BrainIcon, BulbIcon, IdeaIcon, MedalIcon,
    WavingHandIcon, HandPointingRightIcon, HandHelpingIcon,
    ThumbsUpIcon, OkFingerIcon, PiIcon, PiCircleIcon,
    StarIcon, GlobeIcon, PencilIcon, PencilEditIcon,
    DiplomaIcon,
} from "@hugeicons/core-free-icons";

// ── Pool de ícones de educação / mãos / misc ─────────────────────────
const ICON_POOL = [
    BookIcon, BooksIcon, MortarboardIcon, CertificateIcon,
    CompassIcon, PencilRulerIcon, AbacusIcon, CalculatorIcon,
    AtomIcon, BrainIcon, BulbIcon, IdeaIcon, MedalIcon,
    WavingHandIcon, HandPointingRightIcon, HandHelpingIcon,
    ThumbsUpIcon, OkFingerIcon, PiIcon, PiCircleIcon,
    StarIcon, GlobeIcon, PencilIcon, PencilEditIcon,
    DiplomaIcon,
];

// ── Seeded LCG pseudo-random generator ───────────────────────────────
function createRng(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
        h = Math.imul(1664525, h) + 1013904223 | 0;
        return ((h >>> 0) / 0xFFFFFFFF);
    };
}

function rngBetween(rng: () => number, min: number, max: number) {
    return min + rng() * (max - min);
}

interface MemphisIcon {
    icon: typeof BookIcon;
    x: number;
    y: number;
    size: number;
    rotate: number;
    opacity: number;
}

interface MemphisShape {
    type: "dot" | "ring" | "cross" | "zigzag";
    x: number;
    y: number;
    size: number;
    opacity: number;
}

// Embaralha array com o RNG do card (Fisher-Yates)
function shuffle<T>(arr: T[], rng: () => number): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Gera posição dentro de uma célula da grade com jitter
function cellPosition(
    cellIdx: number,
    cols: number,
    rows: number,
    margin: number,
    rng: () => number
) {
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const col = cellIdx % cols;
    const row = Math.floor(cellIdx / cols);
    return {
        x: col * cellW + margin + rng() * (cellW - margin * 2),
        y: row * cellH + margin + rng() * (cellH - margin * 2),
    };
}

function generateItems(seed: string): { icons: MemphisIcon[]; shapes: MemphisShape[] } {
    const rng = createRng(seed);

    // Grade 4×2 = 8 células para ícones (usa 7, descarta 1 aleatória)
    const ICON_COLS = 4, ICON_ROWS = 2;
    const iconCells = shuffle(
        Array.from({ length: ICON_COLS * ICON_ROWS }, (_, i) => i),
        rng
    ).slice(0, 7);

    const icons: MemphisIcon[] = iconCells.map(cellIdx => {
        const { x, y } = cellPosition(cellIdx, ICON_COLS, ICON_ROWS, 6, rng);
        return {
            icon: ICON_POOL[Math.floor(rng() * ICON_POOL.length)],
            x, y,
            size: rngBetween(rng, 14, 36),
            rotate: rngBetween(rng, -50, 50),
            opacity: rngBetween(rng, 0.10, 0.28),
        };
    });

    // Grade 4×2 = 8 células para formas geométricas (usa todas)
    const SHAPE_COLS = 4, SHAPE_ROWS = 2;
    const shapeCells = shuffle(
        Array.from({ length: SHAPE_COLS * SHAPE_ROWS }, (_, i) => i),
        rng
    );

    const shapeTypes: MemphisShape["type"][] = ["dot", "ring", "cross", "zigzag"];
    const shapes: MemphisShape[] = shapeCells.map(cellIdx => {
        const { x, y } = cellPosition(cellIdx, SHAPE_COLS, SHAPE_ROWS, 5, rng);
        return {
            type: shapeTypes[Math.floor(rng() * shapeTypes.length)],
            x, y,
            size: rngBetween(rng, 6, 20),
            opacity: rngBetween(rng, 0.10, 0.24),
        };
    });

    return { icons, shapes };
}

interface CardMemphisBackgroundProps {
    seed: string;
    color: string;
}

export const CardMemphisBackground = ({ seed, color }: CardMemphisBackgroundProps) => {
    const { icons, shapes } = generateItems(seed);

    return (
        <div
            className="absolute inset-0 overflow-hidden rounded-t-3xl"
            style={{ backgroundColor: color }}
            aria-hidden="true"
        >
            {/* Gradiente radial suave para profundidade */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.18) 0%, transparent 60%), " +
                        "radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.10) 0%, transparent 60%)",
                }}
            />

            {/* Ícones espalhados */}
            {icons.map((item, i) => (
                <HugeiconsIcon
                    key={i}
                    icon={item.icon}
                    size={item.size}
                    color="white"
                    style={{
                        position: "absolute",
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `rotate(${item.rotate}deg)`,
                        opacity: item.opacity,
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* Formas geométricas */}
            {shapes.map((shape, i) => {
                const style: React.CSSProperties = {
                    position: "absolute",
                    left: `${shape.x}%`,
                    top: `${shape.y}%`,
                    opacity: shape.opacity,
                    pointerEvents: "none",
                };

                if (shape.type === "dot") return (
                    <div key={i} style={{
                        ...style,
                        width: shape.size,
                        height: shape.size,
                        borderRadius: "50%",
                        backgroundColor: "white",
                    }} />
                );

                if (shape.type === "ring") return (
                    <div key={i} style={{
                        ...style,
                        width: shape.size,
                        height: shape.size,
                        borderRadius: "50%",
                        border: "2px solid white",
                    }} />
                );

                if (shape.type === "cross") return (
                    <svg key={i} width={shape.size} height={shape.size} viewBox="0 0 12 12" style={style}>
                        <line x1="6" y1="1" x2="6" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <line x1="1" y1="6" x2="11" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );

                if (shape.type === "zigzag") {
                    const h = Math.round(shape.size * 0.4);
                    const s = shape.size;
                    const points = [
                        `0,${Math.round(s * 0.35)}`,
                        `${Math.round(s * 0.2)},${Math.round(s * 0.05)}`,
                        `${Math.round(s * 0.4)},${Math.round(s * 0.35)}`,
                        `${Math.round(s * 0.6)},${Math.round(s * 0.05)}`,
                        `${Math.round(s * 0.8)},${Math.round(s * 0.35)}`,
                        `${s},${Math.round(s * 0.05)}`,
                    ].join(" ");

                    return (
                        <svg key={i} width={s} height={h} viewBox={`0 0 ${s} ${h}`} style={style}>
                            <polyline
                                points={points}
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    );
                }

                return null;
            })}
        </div>
    );
};
