import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type FABForm = "create-class" | "join-class" | "create-hand-config" | "create-signal" | null;

interface FABContextValue {
    activeForm: FABForm;
    openForm: (form: FABForm) => void;
    closeForm: () => void;
    registerRefresh: (fn: () => void) => void;
    triggerRefresh: () => void;
}

const FABContext = createContext<FABContextValue | null>(null);

export const FABProvider = ({ children }: { children: ReactNode }) => {
    const [activeForm, setActiveForm] = useState<FABForm>(null);
    const refreshRef = useRef<(() => void) | null>(null);

    // As funções precisam ter identidade estável: as páginas registram o refresh
    // dentro de um useEffect que depende delas. Sem isso, abrir um modal
    // (que troca `activeForm`) recriava `registerRefresh` e disparava um
    // recarregamento desnecessário da listagem por trás do modal.
    const openForm = useCallback((form: FABForm) => setActiveForm(form), []);
    const closeForm = useCallback(() => setActiveForm(null), []);
    const registerRefresh = useCallback((fn: () => void) => { refreshRef.current = fn; }, []);
    const triggerRefresh = useCallback(() => refreshRef.current?.(), []);

    const value = useMemo(
        () => ({ activeForm, openForm, closeForm, registerRefresh, triggerRefresh }),
        [activeForm, openForm, closeForm, registerRefresh, triggerRefresh],
    );

    return <FABContext.Provider value={value}>{children}</FABContext.Provider>;
};

export const useFAB = () => {
    const ctx = useContext(FABContext);
    if (!ctx) throw new Error("useFAB deve ser usado dentro de FABProvider");
    return ctx;
};
