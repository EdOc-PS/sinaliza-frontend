import { useEffect } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const sizeStyles: Record<ModalSize, string> = {
    sm:    "max-w-sm",
    md:    "max-w-md",
    lg:    "max-w-lg",
    xl:    "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
};

interface ModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: (value: boolean) => void;
    size?: ModalSize;
}

const Modal = ({ children, open, onClose, size = "2xl" }: ModalProps) => {

    // Trava o scroll do fundo enquanto o modal está aberto. O padding compensa a
    // largura da barra que some, evitando o conteúdo "pular" para a direita.
    useEffect(() => {
        if (!open) return;

        const root = document.documentElement;
        const { overflow, paddingRight } = document.body.style;
        const rootOverflow = root.style.overflow;
        const scrollbarWidth = window.innerWidth - root.clientWidth;

        // Trava no <html> também: em muitos layouts quem rola é ele, e só o
        // `overflow: hidden` no <body> não segura o fundo.
        root.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            root.style.overflow = rootOverflow;
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 sm:px-6 py-6">
            <div className="absolute inset-0 bg-neutral-500/0 backdrop-blur-xs" />

            {/* A moldura não rola: quem rola é o conteúdo, para a barra ficar
                dentro do modal e não passar por cima do botão de fechar */}
            <div className={`relative flex w-full ${sizeStyles[size]} max-h-[90vh] flex-col overflow-hidden rounded-4xl animate-fade-in bg-white border-2 border-neutral-300 shadow-xl`}>

                {/* right-5 afasta o botão da barra de rolagem do conteúdo (~15px) */}
                <button
                    className="absolute right-5 top-4 z-20 p-2 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50"
                    onClick={() => onClose(false)}
                >
                    <HugeiconsIcon icon={Cancel01Icon} />
                </button>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-10">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default Modal;
