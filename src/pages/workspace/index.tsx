import { useState, useEffect } from "react";

import { useFAB } from "@context/FABContext";

import Modal from "@components/ui/Modal";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";

const WorkspacePage = () => {
    const { registerRefresh } = useFAB();

    const [editingConfig, setEditingConfig] = useState<HandConfigTypeForm | null>(null);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const handleEditConfig = (config: HandConfigTypeForm) => {
        setEditingConfig(config);
        setEditModal(true);
    };

    const handleEditSuccess = () => {
        setEditModal(false);
        setEditingConfig(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleEditClose = () => {
        setEditModal(false);
        setEditingConfig(null);
    };

    // Registra a função de refresh para o FAB usar quando criar nova config
    useEffect(() => {
        registerRefresh(() => {
            setRefreshTrigger(prev => prev + 1);
        });
    }, [registerRefresh]);

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="bg-white rounded-3xl p-6">
                    <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                        Ambiente de
                        <span className="font-baskerville text-campfire-500 italic"> Trabalho</span>
                    </p>
                    <p className="text-neutral-600 text-md">Sinais · Configuração de Mão</p>
                </div>

                <div className="bg-white rounded-3xl p-6">
                    <VisualKeyboard
                        onEdit={handleEditConfig}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </section>

            {/* Modal de edição  */}
            <Modal open={editModal} onClose={handleEditClose}>
                <HandConfigForm
                    handConfig={editingConfig ?? undefined}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                />
            </Modal>
        </>
    );
};

export default WorkspacePage;
