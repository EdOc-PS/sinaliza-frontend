import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type ReactNode } from "react";

// ── Root ──────────────────────────────────────────────────────────────
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// ── Content ───────────────────────────────────────────────────────────
const DropdownMenuContent = ({
    children,
    className = "",
    sideOffset = 6,
    align = "end",
    ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            sideOffset={sideOffset}
            align={align}
            className={`
                z-50 min-w-48 overflow-hidden rounded-3xl border-2 border-cloud-400/30 bg-white shadow-xl 
                shadow-neutral-200/60 p-1
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                data-[side=bottom]:slide-in-from-top-2
                ${className}
            `}
            {...props}
        >
            {children}
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
        {icon && <span className="shrink-0 ">{icon}</span>}
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
