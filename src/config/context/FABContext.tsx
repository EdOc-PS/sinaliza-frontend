import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type FABForm = "create-class" | "join-class" | "create-hand-config" | "create-signal" | null;

interface FABContextValue {
    activeForm: FABForm;
    openForm: (form: FABForm) => void;
    closeForm: () => void;
}

const FABContext = createContext<FABContextValue | null>(null);

/**
 * Guarda apenas qual formulário do FAB está aberto.
 *
 * Antes daqui saía também um `registerRefresh`/`triggerRefresh`: cada tela
 * registrava uma função para o FAB chamar depois de criar algo. Isso saiu com a
 * migração para o TanStack Query — quem cria agora invalida a chave do cache e
 * qualquer tela montada se atualiza sozinha.
 */
export const FABProvider = ({ children }: { children: ReactNode }) => {
    const [activeForm, setActiveForm] = useState<FABForm>(null);

    // Identidade estável: as telas usam essas funções em dependências de efeito.
    const openForm = useCallback((form: FABForm) => setActiveForm(form), []);
    const closeForm = useCallback(() => setActiveForm(null), []);

    const value = useMemo(
        () => ({ activeForm, openForm, closeForm }),
        [activeForm, openForm, closeForm],
    );

    return <FABContext.Provider value={value}>{children}</FABContext.Provider>;
};

export const useFAB = () => {
    const ctx = useContext(FABContext);
    if (!ctx) throw new Error("useFAB deve ser usado dentro de FABProvider");
    return ctx;
};
