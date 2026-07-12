import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useFAB } from "@context/FABContext";

import Modal from "@components/ui/Modal";
import { DisciplineForm } from "@components/feature/classroom/DisciplineForm";
import { JoinDisciplineForm } from "@components/feature/classroom/JoinDisciplineForm";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { SignForm } from "@components/feature/workspace/SignForm";

interface FABActionProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    delay?: string;
    visible: boolean;
}

const FABAction = ({ icon, label, onClick, delay = "0ms", visible }: FABActionProps) => (
    <button
        onClick={onClick}
        style={{ transitionDelay: visible ? delay : "0ms" }}
        className={`
            flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-3xl bg-white
            shadow-lg shadow-neutral-200/60 border-2 border-neutral-200
            text-sm font-semibold text-cloud-700 whitespace-nowrap
            hover:shadow-xl hover:border-cloud-400 transition-all duration-200
            ${visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-3 scale-95 pointer-events-none"
            }
        `}
    >
        {icon}
        {label}
    </button>
);

export const FAB = () => {
    const { user } = useAuth();
    const { activeForm, openForm, closeForm, triggerRefresh } = useFAB();
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);

    const isEducator = !!user?.roles?.includes("EDUCATOR");

    const handleFABClick = () => {
        if (!isEducator) {
            openForm("join-class");
            return;
        }
        setOpen(prev => !prev);
    };

    const handleOpenForm = (form: Parameters<typeof openForm>[0]) => {
        setOpen(false);
        openForm(form);
    };

    const handleSuccess = () => {
        closeForm();
        const currentPath = location.pathname;

        // Se está em classrooms ou workspace, apenas refresh
        if (currentPath === "/classrooms" || currentPath === "/workspace") {
            triggerRefresh();
        } else {
            // Caso contrário, navega para classrooms
            navigate("/classrooms");
        }
    };

    return (
        <>
            <div className="fixed bottom-30 lg:bottom-10 right-5 lg:right-10 z-40 flex flex-col items-end gap-3">
                {isEducator && (
                    <div className="flex flex-col items-end gap-2.5">
                        <FABAction
                            visible={open}
                            delay="180ms"
                            icon={
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lime-100">
                                    <img src="src/assets/images/app/create-class.png" alt="" className="w-6 h-6" />
                                </span>
                            }
                            label="Criar uma turma"
                            onClick={() => handleOpenForm("create-class")}
                        />
                        <FABAction
                            visible={open}
                            delay="120ms"
                            icon={
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-100">
                                    <img src="src/assets/images/app/join-class.png" alt="" className="w-6 h-6" />
                                </span>
                            }
                            label="Participar de uma turma"
                            onClick={() => handleOpenForm("join-class")}
                        />
                        <FABAction
                            visible={open}
                            delay="60ms"
                            icon={
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lime-100">
                                    <img src="src/assets/images/app/create-hand.png" alt="" className="w-6 h-6" />
                                </span>
                            }
                            label="Criar configuração de mão"
                            onClick={() => handleOpenForm("create-hand-config")}
                        />

                        <FABAction
                            visible={open}
                            delay="0ms"
                            icon={
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-salmon-100">
                                    <img src="src/assets/images/app/create-signal.png" alt="" className="w-6 h-6" />
                                </span>
                            }
                            label="Criar sinal"
                            onClick={() => handleOpenForm("create-signal")}
                        />
                    </div>
                )}

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleFABClick}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-cloud-500 shadow-lg shadow-cloud-500/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                    >
                        <HugeiconsIcon
                            icon={AddIcon}
                            size={22}
                            className={`text-white transition-transform duration-200 ease-in-out ${open ? "rotate-45" : "rotate-0"}`}
                        />
                    </button>
                </div>
            </div>

            {/* Modal: Criar turma */}
            <Modal open={activeForm === "create-class"} onClose={closeForm}>
                <DisciplineForm onClose={closeForm} onSuccess={handleSuccess} />
            </Modal>

            {/* Modal: Entrar em turma */}
            <Modal open={activeForm === "join-class"} onClose={closeForm}>
                <JoinDisciplineForm onClose={closeForm} onSuccess={handleSuccess} />
            </Modal>

            {/* Modal: Criar configuração de mão */}
            <Modal open={activeForm === "create-hand-config"} onClose={closeForm}>
                <HandConfigForm onClose={closeForm} onSuccess={handleSuccess} />
            </Modal>

            {/* Modal: Criar sinal */}
            <Modal open={activeForm === "create-signal"} onClose={closeForm} size="3xl">
                <SignForm onClose={closeForm} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
};

export { FAB as ClassroomFAB };
