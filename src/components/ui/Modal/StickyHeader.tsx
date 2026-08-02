interface ModalStickyHeaderProps {
    children: React.ReactNode;
}

// Cabeçalho fixo de um modal com conteúdo rolável (ProgressBar + título).
// As margens negativas sangram sobre o padding do scroller do Modal para o
// fundo branco cobrir o conteúdo que passa por baixo.
//
// O `top` negativo casa com o padding do scroller: `sticky top-0` gruda no
// *content box*, o que deixaria uma faixa do tamanho do padding acima do
// cabeçalho — e o conteúdo rolando apareceria por ali.
export const ModalStickyHeader = ({ children }: ModalStickyHeaderProps) => (
    <div className="sticky -top-6 z-10 -mx-6 -mt-6 flex flex-col gap-6 bg-white px-6 pt-6 pb-4 sm:-top-10 sm:-mx-10 sm:-mt-10 sm:px-10 sm:pt-10">
        {children}
    </div>
);

export default ModalStickyHeader;
