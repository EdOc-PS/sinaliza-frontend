import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const sizeStyles: Record<ModalSize, string> = {
    sm:    "max-w-sm",
    md:    "max-w-md",
    lg:    "max-w-lg",
    xl:    "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
};

interface ModalProps {
    children: React.ReactNode;
    open: boolean;
    onClose: (value: boolean) => void;
    size?: ModalSize;
}

const Modal = ({ children, open, onClose, size = "2xl" }: ModalProps) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-neutral-500/0 backdrop-blur-xs" />

            <div className={`relative w-full ${sizeStyles[size]} p-6 sm:p-10 rounded-4xl animate-fade-in bg-white border-2 border-neutral-300 shadow-xl`}>

                <button
                    className="absolute right-3 top-3 p-2 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50"
                    onClick={() => onClose(false)}
                >
                    <HugeiconsIcon icon={Cancel01Icon} />
                </button>

                {children}
            </div>

        </div>
    )
}

export default Modal;
