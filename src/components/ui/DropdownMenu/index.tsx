import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type ReactNode } from "react";

// ── Root ──────────────────────────────────────────────────────────────
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// ── Constante de cor da borda (cloud-400/30) ───────────────────────────
const BORDER_COLOR = "rgba(92,144,163,0.30)";

// ── Seta (triângulo com borda) ─────────────────────────────────────────
// Técnica CSS clássica: triângulo externo na cor da borda + triângulo
// interno branco deslocado 2px, criando a ilusão de borda nas arestas.

type DropdownAlign = "start" | "center" | "end";

interface ArrowProps {
    align: DropdownAlign;
}

// Seta apontando PARA CIMA — usada quando o conteúdo abre ABAIXO do trigger
const ArrowUp = ({ align }: ArrowProps) => {
    const hPos =
        align === "start"  ? { left: 16 } :
        align === "center" ? { left: "50%", transform: "translateX(-50%)" } :
        { right: 16 };

    return (
        // hidden por padrão; visível via group-data-[side=bottom]
        <span
            aria-hidden
            className="absolute -top-[9px] hidden group-data-[side=bottom]:block pointer-events-none"
            style={{ position: "absolute", ...hPos, width: 0, height: 0,
                     borderLeft: "9px solid transparent",
                     borderRight: "9px solid transparent",
                     borderBottom: `9px solid ${BORDER_COLOR}` }}
        >
            <span style={{ position: "absolute", top: 2, left: -7, width: 0, height: 0,
                           borderLeft: "7px solid transparent",
                           borderRight: "7px solid transparent",
                           borderBottom: "7px solid white" }} />
        </span>
    );
};

// Seta apontando PARA BAIXO — usada quando o conteúdo abre ACIMA do trigger
const ArrowDown = ({ align }: ArrowProps) => {
    const hPos =
        align === "start"  ? { left: 16 } :
        align === "center" ? { left: "50%", transform: "translateX(-50%)" } :
        { right: 16 };

    return (
        <span
            aria-hidden
            className="absolute -bottom-[9px] hidden group-data-[side=top]:block pointer-events-none"
            style={{ position: "absolute", ...hPos, width: 0, height: 0,
                     borderLeft: "9px solid transparent",
                     borderRight: "9px solid transparent",
                     borderTop: `9px solid ${BORDER_COLOR}` }}
        >
            <span style={{ position: "absolute", bottom: 2, left: -7, width: 0, height: 0,
                           borderLeft: "7px solid transparent",
                           borderRight: "7px solid transparent",
                           borderTop: "7px solid white" }} />
        </span>
    );
};

// Seta apontando PARA A DIREITA — conteúdo à esquerda do trigger
const ArrowRight = ({ align }: ArrowProps) => {
    const vPos =
        align === "start"  ? { top: 16 } :
        align === "center" ? { top: "50%", transform: "translateY(-50%)" } :
        { bottom: 16 };

    return (
        <span
            aria-hidden
            className="absolute -right-[9px] hidden group-data-[side=left]:block pointer-events-none"
            style={{ position: "absolute", ...vPos, width: 0, height: 0,
                     borderTop: "9px solid transparent",
                     borderBottom: "9px solid transparent",
                     borderLeft: `9px solid ${BORDER_COLOR}` }}
        >
            <span style={{ position: "absolute", top: -7, left: -9, width: 0, height: 0,
                           borderTop: "7px solid transparent",
                           borderBottom: "7px solid transparent",
                           borderLeft: "7px solid white" }} />
        </span>
    );
};

// Seta apontando PARA A ESQUERDA — conteúdo à direita do trigger
const ArrowLeft = ({ align }: ArrowProps) => {
    const vPos =
        align === "start"  ? { top: 16 } :
        align === "center" ? { top: "50%", transform: "translateY(-50%)" } :
        { bottom: 16 };

    return (
        <span
            aria-hidden
            className="absolute -left-[9px] hidden group-data-[side=right]:block pointer-events-none"
            style={{ position: "absolute", ...vPos, width: 0, height: 0,
                     borderTop: "9px solid transparent",
                     borderBottom: "9px solid transparent",
                     borderRight: `9px solid ${BORDER_COLOR}` }}
        >
            <span style={{ position: "absolute", top: -7, right: -9, width: 0, height: 0,
                           borderTop: "7px solid transparent",
                           borderBottom: "7px solid transparent",
                           borderRight: "7px solid white" }} />
        </span>
    );
};

// ── Content ───────────────────────────────────────────────────────────
interface DropdownMenuContentProps extends DropdownMenuPrimitive.DropdownMenuContentProps {
    align?: DropdownAlign;
}

const DropdownMenuContent = ({
    children,
    className = "",
    sideOffset = 10,
    align = "end",
    ...props
}: DropdownMenuContentProps) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            align={align}
            className={`
                group relative z-50 min-w-48 overflow-visible rounded-3xl
                border-2 border-cloud-400/30 bg-white
                shadow-xl shadow-neutral-200/60 p-1
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                data-[side=bottom]:slide-in-from-top-2
                ${className}
            `}
            {...props}
        >
            {children}

            {/* Setas — CSS mostra apenas a correta via group-data-[side=*] */}
            <ArrowUp    align={align} />
            <ArrowDown  align={align} />
            <ArrowRight align={align} />
            <ArrowLeft  align={align} />
        </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
);

// ── Item ─────────────────────────────────────────────────────────────
interface DropdownMenuItemProps extends DropdownMenuPrimitive.DropdownMenuItemProps {
    icon?: ReactNode;
    variant?: "default" | "danger";
}

const DropdownMenuItem = ({
    children,
    icon,
    variant = "default",
    className = "",
    ...props
}: DropdownMenuItemProps) => (
    <DropdownMenuPrimitive.Item
        className={`
            flex items-center gap-3 px-4 py-3 rounded-3xl text-sm cursor-pointer
            outline-none select-none transition-colors duration-150 font-semibold
            ${variant === "danger"
                ? "text-error-500 focus:bg-error-100"
                : "text-cloud-700 focus:bg-cloud-100"
            }
            ${className}
        `}
        {...props}
    >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
    </DropdownMenuPrimitive.Item>
);

// ── Separator ────────────────────────────────────────────────────────
const DropdownMenuSeparator = ({
    className = "",
    ...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) => (
    <DropdownMenuPrimitive.Separator
        className={`my-1 h-0.5 bg-cloud-400/20 rounded-3xl ${className}`}
        {...props}
    />
);

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
