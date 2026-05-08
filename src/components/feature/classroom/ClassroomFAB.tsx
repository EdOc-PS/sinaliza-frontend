import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface ClassroomFABProps {
    userRole?: string;
    onCreateClick: () => void;
    onJoinClick: () => void;
}

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

export const ClassroomFAB = ({ userRole, onCreateClick, onJoinClick }: ClassroomFABProps) => {
    const [open, setOpen] = useState(false);
    const isEducator = userRole === "EDUCATOR";

    const handleFABClick = () => {
        if (!isEducator) {
            onJoinClick();
            return;
        }
        setOpen(prev => !prev);
    };

    const handleAction = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <div className="fixed bottom-8 right-10 z-40 flex flex-col items-end gap-3">

            {isEducator && (
                <div className="flex flex-col items-end gap-2.5">
                    <FABAction
                        visible={open}
                        delay="60ms"
                        icon={
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lime-100">
                                <img src="src/assets/app/create-class.png" alt="" className="w-6 h-6" />
                            </span>
                        }
                        label="Criar uma turma"
                        onClick={() => handleAction(onCreateClick)}
                    />
                    <FABAction
                        visible={open}
                        delay="0ms"
                        icon={
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-100">
                                <img src="src/assets/app/join-class.png" alt="" className="w-6 h-6" />
                            </span>
                        }
                        label="Participar de uma turma"
                        onClick={() => handleAction(onJoinClick)}
                    />
                </div>
            )}

            {/* FAB principal */}
            <button
                onClick={handleFABClick}
                className="w-16 h-16 rounded-full bg-cloud-500 shadow-xl shadow-cloud-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
            >
                <HugeiconsIcon
                    icon={AddIcon}
                    size={30}
                    className={`text-white transition-transform duration-200 ease-in-out ${open ? "rotate-45" : "rotate-0"}`}
                />
            </button>
        </div>
    );
};
