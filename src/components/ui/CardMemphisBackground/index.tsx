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

function generateItems(seed: string): { icons: MemphisIcon[]; shapes: MemphisShape[] } {
    const rng = createRng(seed);

    const icons: MemphisIcon[] = Array.from({ length: 7 }, () => ({
        icon: ICON_POOL[Math.floor(rng() * ICON_POOL.length)],
        x: rngBetween(rng, 2, 92),
        y: rngBetween(rng, 2, 88),
        size: rngBetween(rng, 14, 40),
        rotate: rngBetween(rng, -50, 50),
        opacity: rngBetween(rng, 0.10, 0.28),
    }));

    const shapeTypes: MemphisShape["type"][] = ["dot", "ring", "cross", "zigzag"];
    const shapes: MemphisShape[] = Array.from({ length: 8 }, () => ({
        type: shapeTypes[Math.floor(rng() * shapeTypes.length)],
        x: rngBetween(rng, 3, 90),
        y: rngBetween(rng, 3, 90),
        size: rngBetween(rng, 6, 22),
        opacity: rngBetween(rng, 0.10, 0.26),
    }));

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
