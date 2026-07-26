import { useEffect } from "react";

// Se o IntersectionObserver não entregar nenhum callback nesse tempo, assume-se
// que ele não funciona no ambiente e todo o conteúdo é revelado de uma vez.
const FALLBACK_DELAY = 1500;

// Revela elementos com a classe `.reveal` quando entram na viewport,
// adicionando `.is-visible`. Usado na landing page e no repositório público.
//
// O estado oculto vive em `.reveal-active .reveal` (ver index.css) e a classe
// `reveal-active` só é aplicada aqui — sem JS o conteúdo nunca fica invisível.
export function useScrollReveal() {
    useEffect(() => {
        const root = document.documentElement;

        const revealAll = () => {
            document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
        };

        // Ambiente sem IntersectionObserver: mostra tudo, sem sequer ativar o estado oculto
        if (typeof IntersectionObserver === "undefined") {
            revealAll();
            return;
        }

        root.classList.add("reveal-active");

        let delivered = false;

        const observer = new IntersectionObserver(
            (entries) => {
                delivered = true;
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
        );

        const observeAll = () => {
            document
                .querySelectorAll(".reveal:not(.is-visible)")
                .forEach((el) => observer.observe(el));
        };

        observeAll();

        // Conteúdo carregado depois (ex: cards vindos da API) também é observado
        const mutationObserver = new MutationObserver(observeAll);
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // Rede de segurança: o observer nunca entregou nada (crawler, webview, prerender)
        const fallbackTimer = window.setTimeout(() => {
            if (delivered) return;
            observer.disconnect();
            mutationObserver.disconnect();
            revealAll();
        }, FALLBACK_DELAY);

        return () => {
            window.clearTimeout(fallbackTimer);
            observer.disconnect();
            mutationObserver.disconnect();
            root.classList.remove("reveal-active");
        };
    }, []);
}

export default useScrollReveal;
