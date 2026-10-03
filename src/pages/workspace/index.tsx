import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@context/AuthContext";
import { queryKeys } from "@/config/query/queryKeys";

import Modal from "@components/ui/Modal";
import ActionButton from "@components/ui/ActionButton";
import { SignForm } from "@components/feature/workspace/SignForm";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";
import { PromotionSection } from "@components/feature/workspace/PromotionSection";
import { MySignsSection } from "@components/feature/workspace/MySignsSection";
import { CategorySection } from "@components/feature/workspace/CategorySection";
import { GlossaryDisciplineSection } from "@components/feature/workspace/GlossaryDisciplineSection";

import { LoadingGroup } from "@lib/hooks/useLoadingGroup";

import createSignalImg from "@/assets/images/app/create-signal.png";

// Ambiente de trabalho de educador e gestor. O gestor vê o mesmo teclado de
// mãos com edição liberada e, abaixo, a área administrativa (aprovação de
// promoções, categorias e disciplinas do glossário). O Dashboard fica só com
// os números de uso.
const WorkspacePage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isManager = !!user?.roles?.includes("MANAGER");

    const [signModal, setSignModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState<HandConfigTypeForm | null>(null);

    const closeEditConfig = () => setEditingConfig(null);
    const handleEditConfigSuccess = () => {
        setEditingConfig(null);
        queryClient.invalidateQueries({ queryKey: queryKeys.handConfigs.all });
    };

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="bg-white rounded-3xl p-6 flex flex-col gap-6">
                    <div>
                        <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                            Ambiente de
                            <span className="font-baskerville text-campfire-500 italic"> Trabalho</span>
                        </p>
                        <p className="text-neutral-600 text-md">
                            {isManager ? "Sinais · Configuração de Mão · Administração" : "Sinais · Configuração de Mão"}
                        </p>
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
                        <MySignsSection />

                        {/* Teclado único: só o gestor edita, exclui e cria pelo card "+" */}
                        <div className="bg-white rounded-3xl p-6">
                            <VisualKeyboard canManage={isManager} onEdit={setEditingConfig} />
                        </div>

                        {/* Promoções pendentes — educador acompanha, gestor aprova/recusa */}
                        <PromotionSection canReview={isManager} />

                        {isManager && (
                            <div className="flex flex-col gap-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-cloud-400">
                                    Administração
                                </p>
                                <CategorySection />
                                <GlossaryDisciplineSection />
                            </div>
                        )}
                    </div>
                </LoadingGroup>
            </section>

            {/* Modal criar sinal */}
            <Modal open={signModal} onClose={() => setSignModal(false)} size="2xl">
                <SignForm
                    onClose={() => setSignModal(false)}
                    onSuccess={() => {
                        setSignModal(false);
                        queryClient.invalidateQueries({ queryKey: queryKeys.signs.mine() });
                    }}
                />
            </Modal>

            {/* Modal editar configuração de mão (gestor) */}
            <Modal open={!!editingConfig} onClose={closeEditConfig}>
                <HandConfigForm
                    handConfig={editingConfig ?? undefined}
                    onClose={closeEditConfig}
                    onSuccess={handleEditConfigSuccess}
                />
            </Modal>
        </>
    );
};

export default WorkspacePage;
