import { Fragment, type ReactNode } from "react";

interface WordRevealProps {
    /** Linhas do título; cada item vira uma linha (quebra com <br/>) */
    lines: ReactNode[][];
    /** Atraso inicial em ms */
    delay?: number;
    /** Intervalo entre palavras em ms */
    step?: number;
}

// Título que entra palavra por palavra com blur. Cada palavra é um item do array
// (string ou JSX, para palavras com destaque). Dentro de um `.reveal`, a animação
// espera a seção aparecer na tela (ver index.css).
export const WordReveal = ({ lines, delay = 0, step = 70 }: WordRevealProps) => {
    let index = 0;

    return (
        <>
            {lines.map((words, li) => (
                <Fragment key={li}>
                    {li > 0 && <br />}
                    {words.map((word, wi) => {
                        const current = index++;
                        return (
                            <Fragment key={wi}>
                                {wi > 0 && " "}
                                <span className="word-in" style={{ animationDelay: `${delay + current * step}ms` }}>
                                    {word}
                                </span>
                            </Fragment>
                        );
                    })}
                </Fragment>
            ))}
        </>
    );
};

export default WordReveal;
