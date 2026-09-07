import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface AccordionProps {
    open: boolean;
    children: React.ReactNode;
    /** Duração da animação em ms */
    duration?: number;
    id?: string;
}

/**
 * Acordeão que anima a altura real do conteúdo.
 *
 * Evita de propósito o truque de `grid-template-rows: 0fr -> 1fr`: quando a
 * altura do conteúdo é intrínseca, o `1fr` resolve contra espaço livre zero
 * durante a transição e o painel nunca abre. Medir com ResizeObserver e animar
 * `height` em px funciona sempre e acompanha conteúdo que muda de tamanho
 * (ex: paginação do teclado de mãos).
 */
export const Accordion = ({ open, children, duration = 350, id }: AccordionProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    // Remede a cada abertura: garante altura correta mesmo se o ResizeObserver
    // não tiver entregue nada (ele depende do ciclo de renderização do navegador).
    useLayoutEffect(() => {
        if (open && contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    }, [open]);

    // Acompanha conteúdo que muda de tamanho com o painel já aberto
    // (ex: paginação do teclado de mãos, imagens carregando).
    useEffect(() => {
        const element = contentRef.current;
        if (!element || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(() => setContentHeight(element.scrollHeight));
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            id={id}
            style={{
                height: open ? contentHeight : 0,
                transitionDuration: `${duration}ms`,
            }}
            className="overflow-hidden transition-[height] ease-out"
            aria-hidden={!open}
        >
            <div ref={contentRef}>{children}</div>
        </div>
    );
};

export default Accordion;
