import type { ReactNode } from "react";
import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";
import { Medal06Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

// Modal de confirmação genérico (não destrutivo) — irmão do ConfirmDeleteModal,
// mas com visual positivo (campfire) para ações como promover um sinal.
interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title: ReactNode;
    description: ReactNode;
    icon?: IconSvgElement;
    confirmText?: string;
    loadingText?: string;
}

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    title,
    description,
    icon = Medal06Icon,
    confirmText = "Confirmar",
    loadingText = "Enviando...",
}: ConfirmModalProps) => {
    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="flex flex-col gap-6 items-center">

                {/* Ícone */}
                <div className="flex justify-center pt-2">
                    <div className="w-16 h-16 rounded-3xl bg-campfire-100 flex items-center justify-center">
                        <HugeiconsIcon icon={icon} size={32} className="text-campfire-600" />
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
                        variant="campfire"
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

export default ConfirmModal;
