import { createContext, useContext, useRef, useState, type ReactNode } from "react";

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

    return (
        <FABContext.Provider value={{
            activeForm,
            openForm: setActiveForm,
            closeForm: () => setActiveForm(null),
            registerRefresh: (fn) => { refreshRef.current = fn; },
            triggerRefresh: () => refreshRef.current?.(),
        }}>
            {children}
        </FABContext.Provider>
    );
};

export const useFAB = () => {
    const ctx = useContext(FABContext);
    if (!ctx) throw new Error("useFAB deve ser usado dentro de FABProvider");
    return ctx;
};
