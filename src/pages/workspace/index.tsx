import { useState, useEffect } from "react";

import { useFAB } from "@context/FABContext";
import { useAuth } from "@context/AuthContext";

import Modal from "@components/ui/Modal";
import ActionButton from "@components/ui/ActionButton";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { SignForm } from "@components/feature/workspace/SignForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";
import { CategorySection } from "@components/feature/workspace/CategorySection";
import { PromotionSection } from "@components/feature/workspace/PromotionSection";

import createSignalImg from "@/assets/images/app/create-signal.png";
import createHandImg from "@/assets/images/app/create-hand.png";

const WorkspacePage = () => {
    const { registerRefresh } = useFAB();
    const { user } = useAuth();
    const isManager = !!user?.roles?.includes("MANAGER");
    const isEducator = !!user?.roles?.includes("EDUCATOR");

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
                        <ActionButton
                            variant="cloud"
                            image={createSignalImg}
                            title="Criar novo sinal"
                            description="Publique um sinal no repositório global"
                            onClick={() => setSignModal(true)}
                            className="flex-[1.5]"
                        />

                        {/* Nova configuração de mão */}
                        <ActionButton
                            variant="lime"
                            image={createHandImg}
                            title="Nova configuração de mão"
                            description="Adicione ao teclado visual"
                            onClick={() => setHandModal(true)}
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6">
                    <VisualKeyboard
                        onEdit={handleEditConfig}
                        refreshTrigger={refreshTrigger}
                    />
                </div>

                {/* Promoções pendentes — educador visualiza, só gestor aprova/recusa */}
                {(isManager || isEducator) && <PromotionSection canReview={isManager} />}

                {/* Categorias — CRUD para o educador */}
                <CategorySection />
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
