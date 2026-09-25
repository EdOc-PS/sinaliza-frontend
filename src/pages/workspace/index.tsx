import { useState } from "react";
import { useAuth } from "@context/AuthContext";

import Modal from "@components/ui/Modal";
import ActionButton from "@components/ui/ActionButton";
import { SignForm } from "@components/feature/workspace/SignForm";
import { VisualKeyboard } from "@components/feature/workspace/VisualKeyboard";
import { PromotionSection } from "@components/feature/workspace/PromotionSection";

import { LoadingGroup } from "@lib/hooks/useLoadingGroup";

import createSignalImg from "@/assets/images/app/create-signal.png";

// Itens exclusivos do gestor (configuração de mão, promoções com poder de
// aprovar, administração do glossário) vivem no Dashboard — aqui fica só o
// que educador e gestor usam no dia a dia de criar/organizar sinais.
const WorkspacePage = () => {
    const { user } = useAuth();
    const isManager = !!user?.roles?.includes("MANAGER");
    const isEducator = !!user?.roles?.includes("EDUCATOR");

    const [signModal, setSignModal] = useState<boolean>(false);

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

                    <ActionButton
                        variant="cloud"
                        image={createSignalImg}
                        title="Criar novo sinal"
                        description="Publique um sinal no repositório global"
                        onClick={() => setSignModal(true)}
                        className="w-full"
                    />
                </div>

                {/* Um spinner só para a tela inteira, em vez de um por card */}
                <LoadingGroup>
                    <div className="flex flex-col gap-10">
                        <div className="bg-white rounded-3xl p-6">
                            <VisualKeyboard canManage={false} />
                        </div>

                        {/* Promoções pendentes — o gestor revisa a partir do Dashboard */}
                        {isEducator && !isManager && <PromotionSection canReview={false} />}
                    </div>
                </LoadingGroup>
            </section>

            {/* Modal criar sinal */}
            <Modal open={signModal} onClose={() => setSignModal(false)} size="2xl">
                <SignForm
                    onClose={() => setSignModal(false)}
                    onSuccess={() => { setSignModal(false); }}
                />
            </Modal>
        </>
    );
};

export default WorkspacePage;
