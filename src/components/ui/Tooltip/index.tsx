import { useState, type ReactNode } from "react";

export interface TooltipProps {
    label: string;
    children: ReactNode;
    /**
     * Onde a bolha aparece em relação ao elemento:
     * - "left": à direita do elemento (usado na sidebar desktop, que fica à esquerda da tela)
     * - "right": à esquerda do elemento (espelho de "left" — usado em botões perto da borda direita)
     * - "top": acima do elemento, seta apontando para baixo (usado na barra inferior mobile)
     * - "bottom": abaixo do elemento, seta apontando para cima (usado em botões no topo da tela)
     */
    position?: "left" | "right" | "top" | "bottom";
    bgColor?: string;
    /** Classes extras no wrapper — útil quando o próprio trigger precisa de `absolute`/`fixed` */
    className?: string;
}

const COLOR_MAP: Record<string, string> = {
    "bg-cloud-700": "#132433",
    "bg-salmon-500": "#EEA2A2",
};

// Bolha de tooltip "toast" — mesmo estilo usado nos itens do menu lateral,
// para qualquer botão que precise de uma dica ao passar o mouse (sem o tooltip nativo do navegador).
export const Tooltip = ({ label, children, position = "left", bgColor = "bg-cloud-700", className = "" }: TooltipProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const arrowFill = COLOR_MAP[bgColor] || "#132433";

    const bubblePosition = {
        left: "left-full ml-3 top-1/2 -translate-y-1/2",
        right: "right-full mr-3 top-1/2 -translate-y-1/2",
        top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
        bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    }[position];

    // O wrapper precisa de algum `position` não-estático para a bolha se ancorar.
    // Se o chamador já define um (ex: "absolute ..." para posicionar o próprio botão
    // na página), não force "relative" por cima — as duas juntas colidem no CSS.
    return (
        <div
            className={className || "relative"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {isHovered && (
                <div
                    className={`
                        absolute z-50 text-white px-3 py-2 rounded-full text-sm font-medium
                        whitespace-nowrap shadow-lg pointer-events-none
                        ${bgColor} ${bubblePosition}
                    `}
                >
                    {label}

                    {position === "left" && (
                        <svg className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 8 2 Q 4 5 8 8 L 2 5 Z" />
                        </svg>
                    )}
                    {position === "right" && (
                        <svg className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 2 2 Q 6 5 2 8 L 8 5 Z" />
                        </svg>
                    )}
                    {position === "top" && (
                        <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 2 2 Q 5 4 8 2 L 5 8 Z" />
                        </svg>
                    )}
                    {position === "bottom" && (
                        <svg className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-7" viewBox="0 0 10 10" fill={arrowFill}>
                            <path d="M 2 8 Q 5 5 8 8 L 5 2 Z" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
