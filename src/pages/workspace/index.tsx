import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { HandPointingRight02Icon } from "@hugeicons/core-free-icons";

import { useFAB } from "@context/FABContext";

import Modal from "@components/ui/Modal";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { SignForm } from "@components/feature/workspace/SignForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";

const WorkspacePage = () => {
    const { registerRefresh } = useFAB();

    const [editingConfig, setEditingConfig] = useState<HandConfigTypeForm | null>(null);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [signModal, setSignModal] = useState<boolean>(false);
    const [handModal, setHandModal] = useState<boolean>(false);
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

    const handleHandSuccess = () => {
        setHandModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        registerRefresh(() => {
            setRefreshTrigger(prev => prev + 1);
        });
    }, [registerRefresh]);

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="bg-white rounded-3xl p-6 flex flex-col gap-6">
                    <div>
                        <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                            Ambiente de
                            <span className="font-baskerville text-campfire-500 italic"> Trabalho</span>
                        </p>
                        <p className="text-neutral-600 text-md">Sinais · Configuração de Mão</p>
                    </div>

                    {/* Cards de ação */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Criar novo sinal — ocupa mais espaço */}
                        <button
                            onClick={() => setSignModal(true)}
                            className="group flex flex-[1.5] items-center gap-4 rounded-2xl bg-cloud-500 px-5 py-4 text-left transition-all hover:bg-cloud-600 cursor-pointer"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                <img src="src/assets/images/app/create-signal.png" alt="" className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white">Criar novo sinal</p>
                                <p className="text-sm text-white/60 truncate">Publique um sinal no repositório global</p>
                            </div>
                            <HugeiconsIcon icon={HandPointingRight02Icon} size={20} className="text-white/50 group-hover:text-white/80 transition-colors shrink-0" />
                        </button>

                        {/* Nova configuração de mão */}
                        <button
                            onClick={() => setHandModal(true)}
                            className="group flex flex-1 items-center gap-4 rounded-2xl bg-lime-100 px-5 py-4 text-left transition-all hover:bg-lime-200 cursor-pointer"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-200">
                                <img src="src/assets/images/app/create-hand.png" alt="" className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-lime-700">Nova configuração de mão</p>
                                <p className="text-sm text-lime-600 truncate">Adicione ao teclado visual</p>
                            </div>
                            <HugeiconsIcon icon={HandPointingRight02Icon} size={20} className="text-lime-400 group-hover:text-lime-600 transition-colors shrink-0" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6">
                    <VisualKeyboard
                        onEdit={handleEditConfig}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </section>

            {/* Modal criar sinal */}
            <Modal open={signModal} onClose={() => setSignModal(false)} size="2xl">
                <SignForm
                    onClose={() => setSignModal(false)}
                    onSuccess={() => { setSignModal(false); }}
                />
            </Modal>

            {/* Modal criar configuração de mão */}
            <Modal open={handModal} onClose={() => setHandModal(false)}>
                <HandConfigForm
                    onClose={() => setHandModal(false)}
                    onSuccess={handleHandSuccess}
                />
            </Modal>

            {/* Modal de edição */}
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
