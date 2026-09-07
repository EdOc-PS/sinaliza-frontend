import {
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import Spinner from "@components/ui/Spinner";

interface LoadingGroupValue {
    report: (id: string, loading: boolean) => void;
}

const LoadingGroupContext = createContext<LoadingGroupValue | null>(null);

/**
 * Agrupa vários carregamentos independentes em um spinner só.
 *
 * Telas como o Ambiente de Trabalho montam várias seções que buscam dados em
 * paralelo — sem isso cada card mostra o próprio spinner e a tela "pisca" em
 * pedaços. Aqui os filhos continuam montados (para as requisições dispararem),
 * mas ficam ocultos até que todos terminem.
 */
export const LoadingGroup = ({ children }: { children: ReactNode }) => {
    const [pending, setPending] = useState<Record<string, boolean>>({});

    const report = useCallback((id: string, loading: boolean) => {
        setPending((prev) => (prev[id] === loading ? prev : { ...prev, [id]: loading }));
    }, []);

    const value = useMemo(() => ({ report }), [report]);
    const loading = Object.values(pending).some(Boolean);

    return (
        <LoadingGroupContext.Provider value={value}>
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <Spinner size={32} color="#6B7280" />
                </div>
            )}
            {/* `invisible` (e não `hidden`) mantém os filhos montados e medíveis,
                para que as requisições rodem e o layout não salte ao aparecer. */}
            <div className={loading ? "invisible h-0 overflow-hidden" : "contents"}>
                {children}
            </div>
        </LoadingGroupContext.Provider>
    );
};

/**
 * Informa ao `LoadingGroup` mais próximo se este componente ainda está carregando.
 * Fora de um grupo é inofensivo — o componente segue com o próprio spinner.
 */
export const useReportLoading = (id: string, loading: boolean) => {
    const ctx = useContext(LoadingGroupContext);

    // useLayoutEffect: reporta antes da pintura, evitando um flash de conteúdo
    // vazio antes do spinner do grupo aparecer.
    useLayoutEffect(() => {
        ctx?.report(id, loading);
    }, [ctx, id, loading]);

    useLayoutEffect(() => {
        return () => ctx?.report(id, false);
    }, [ctx, id]);
};
