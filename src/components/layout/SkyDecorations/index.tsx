import type { CSSProperties } from "react";

interface CloudProps {
    width: number;
    className?: string;
    style?: CSSProperties;
    opacity?: number;
}

// Nuvem fofa montada com elipses sobrepostas
const Cloud = ({ width, className = "", style, opacity = 1 }: CloudProps) => (
    <div className={`absolute ${className}`} style={style}>
        <svg
            width={width}
            viewBox="0 0 140 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity, display: "block" }}
        >
            <g fill="#ffffff">
                <ellipse cx="40" cy="38" rx="28" ry="17" />
                <ellipse cx="68" cy="28" rx="24" ry="20" />
                <ellipse cx="97" cy="39" rx="26" ry="16" />
                <rect x="14" y="38" width="112" height="17" rx="8.5" />
            </g>
        </svg>
    </div>
);

interface SkyDecorationsProps {
    /** Sol estático — usado apenas no hero da landing */
    sun?: boolean;
}

// Nuvens (e opcionalmente o sol) da faixa azul.
// Parte das nuvens deriva lentamente no eixo X; o sol é estático.
export const SkyDecorations = ({ sun = false }: SkyDecorationsProps) => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Sol com brilho — sem animação */}
        {sun && (
            <div className="absolute right-[7%] top-[8%] sm:right-[10%]">
                <div className="relative">
                    {/* Halo externo */}
                    <div className="absolute -inset-7 rounded-full bg-sunflower-300/25 blur-2xl" />
                    <div className="absolute -inset-3 rounded-full bg-sunflower-200/40 blur-lg" />
                    {/* Disco */}
                    <div
                        className="relative h-20 w-20 rounded-full sm:h-28 sm:w-28"
                        style={{
                            background: "radial-gradient(circle at 34% 30%, #FCE9B3 0%, #F9D66B 45%, #F5C44E 100%)",
                        }}
                    />
                </div>
            </div>
        )}

        {/* Nuvens — só algumas derivam, em ritmos e distâncias diferentes */}
        <Cloud
            width={170}
            className="cloud-drift"
            style={{ top: "5%", right: "20%", "--cloud-drift": "30px" } as CSSProperties}
            opacity={0.95}
        />
        <Cloud width={110} style={{ top: "17%", right: "6%" }} opacity={0.8} />
        <Cloud
            width={200}
            className="cloud-drift-slow"
            style={{ top: "9%", left: "4%", "--cloud-drift": "38px" } as CSSProperties}
            opacity={0.9}
        />
        <Cloud width={120} style={{ top: "19%", left: "18%" }} opacity={0.7} />
        <Cloud
            width={80}
            className="cloud-drift"
            style={{ top: "3%", left: "31%", "--cloud-drift": "-22px" } as CSSProperties}
            opacity={0.55}
        />
        <Cloud width={140} style={{ top: "22%", right: "34%" }} opacity={0.5} />
    </div>
);

export default SkyDecorations;
