import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { DeleteIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ConfirmDeleteDiciplineProps {
    open: boolean;
    disciplineName?: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDeleteDicipline = ({
    open,
    disciplineName,
    loading,
    onConfirm,
    onCancel,
}: ConfirmDeleteDiciplineProps) => {
    return (
        <Modal open={open} onClose={onCancel}>
            <div className="flex flex-col gap-6 jcustify-center items-center">

                {/* Ícone de lixeira */}
                <div className="flex justify-center pt-2">
                    <div className="w-16 h-16 rounded-2xl bg-salmon-100 flex items-center justify-center">
                        <HugeiconsIcon icon={DeleteIcon} size={32} className="text-salmon-600" />
                    </div>
                </div>

                {/* Título */}
                <div className="text-center font-semibold text-2xl">
                    <h2 className=" text-cloud-700 font-baskerville">Excluir 
                        <span className="text-salmon-600 font-baskerville"> Diciplina</span>?
                    </h2>
                </div>


                {/* Descrição */}
                {disciplineName && (
                    <p className="text-sm text-neutral-600 text-center leading-relaxed w-2/3">
                        A turma <span className="font-semibold text-salmon-600 font-baskerville italic">{disciplineName}</span> será removida permanentemente. Os alunos perderão o acesso. Esta ação não pode ser desfeita.
                    </p>
                )}

                {/* Alerta */}
                <div className="flex gap-3 p-4 bg-error-100 rounded-3xl border-2 border-error-500">
                    <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-error-700 shrink-0" />
                    <p className="text-sm text-error-700 font-medium">
                        Todos os sinais provisorios e histórico da turma serão apagados.
                    </p>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-2 w-full">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="salmon"
                        className="flex-1 rounded-full"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deletando..." : "Excluir turma"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
