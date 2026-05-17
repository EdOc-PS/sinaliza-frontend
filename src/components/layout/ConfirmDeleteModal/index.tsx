import type { ReactNode } from "react";
import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";
import { DeleteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    /** Título principal do modal */
    title: ReactNode;
    /** Descrição/texto de confirmação */
    description: ReactNode;
    /** Texto do botão de confirmar (default: "Excluir") */
    confirmText?: string;
    /** Texto durante o loading (default: "Deletando...") */
    loadingText?: string;
}

const ConfirmDeleteModal = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    title,
    description,
    confirmText = "Excluir",
    loadingText = "Deletando...",
}: ConfirmDeleteModalProps) => {
    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="flex flex-col gap-6 items-center">

                {/* Ícone */}
                <div className="flex justify-center pt-2">
                    <div className="w-16 h-16 rounded-3xl bg-salmon-100 flex items-center justify-center">
                        <HugeiconsIcon icon={DeleteIcon} size={32} className="text-salmon-600" />
                    </div>
                </div>

                {/* Título */}
                <div className="text-center text-2xl font-semibold font-baskerville text-cloud-700">
                    {title}
                </div>

                {/* Descrição */}
                <p className="text-sm text-neutral-600 text-center leading-relaxed w-5/6">
                    {description}
                </p>

                {/* Ações */}
                <div className="flex gap-3 pt-1 w-full">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-1/3"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="salmon"
                        className="flex-1"
                        onClick={onConfirm}
                        loading={loading}
                        loadingText={loadingText}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
