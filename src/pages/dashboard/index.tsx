import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartIcon } from "@hugeicons/core-free-icons";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { GetRequest, PatchRequest } from "@requests";
import { SIGNS } from "@routes/signs";

import Modal from "@components/ui/Modal";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";
import { GlossaryDisciplineSection } from "@components/feature/workspace/GlossaryDisciplineSection";
import { CategorySection } from "@components/feature/workspace/CategorySection";
import { PromotionSection } from "@components/feature/workspace/PromotionSection";
import PromoteSignModal from "@components/feature/workspace/PromoteSignModal";
import { SignUsageSection, type SignUsage } from "@components/feature/dashboard/SignUsageSection";

import { LoadingGroup, useReportLoading } from "@lib/hooks/useLoadingGroup";

interface UsageStats {
    mostUsed: SignUsage[];
    leastUsed: SignUsage[];
}

interface UsageStatsSectionProps {
    onPromote: (sign: SignUsage) => void;
}

// Componente próprio só para o report de loading acontecer dentro da árvore
// do LoadingGroup (o hook precisa rodar num descendente do Provider, não no
// componente que o declara) — assim entra no mesmo spinner único da página.
const UsageStatsSection = ({ onPromote }: UsageStatsSectionProps) => {
    const { data: usageStats, isPending: loadingUsage } = useQuery({
        queryKey: queryKeys.signs.usageStats(),
        queryFn: () => unwrap(GetRequest<UsageStats>(SIGNS.USAGE_STATS())),
        meta: { errorMessage: "Falha ao carregar estatísticas de uso" },
    });
    useReportLoading("usage-stats", loadingUsage);

    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cloud-400">
                Sinais mais e menos usados
            </p>
            <SignUsageSection
                mostUsed={usageStats?.mostUsed ?? []}
                leastUsed={usageStats?.leastUsed ?? []}
                onPromote={onPromote}
            />
        </div>
    );
};

const DashboardPage = () => {
    const queryClient = useQueryClient();

    const [editingConfig, setEditingConfig] = useState<HandConfigTypeForm | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [promoteModal, setPromoteModal] = useState<{ open: boolean; signId?: string; name?: string }>({ open: false });

    const handleEditConfig = (config: HandConfigTypeForm) => {
        setEditingConfig(config);
        setEditModal(true);
    };

    const invalidateHandConfigs = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.handConfigs.all });

    const handleEditSuccess = () => {
        setEditModal(false);
        setEditingConfig(null);
        invalidateHandConfigs();
    };

    const handleEditClose = () => {
        setEditModal(false);
        setEditingConfig(null);
    };

    const { mutate: promoteSign, isPending: promoting } = useMutation({
        mutationFn: (glossaryDisciplineIds: string[]) =>
            unwrap(PatchRequest(SIGNS.PROMOTE(promoteModal.signId!), { glossaryDisciplineIds })),
        onSuccess: () => {
            toast.success("Sinal enviado para aprovação do gestor!");
            setPromoteModal({ open: false });
            queryClient.invalidateQueries({ queryKey: queryKeys.signs.usageStats() });
            queryClient.invalidateQueries({ queryKey: queryKeys.signs.promotions() });
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const handlePromoteClick = (sign: SignUsage) => setPromoteModal({ open: true, signId: sign.id, name: sign.name });
    const handlePromoteConfirm = (ids: string[]) => {
        if (!promoteModal.signId) return;
        promoteSign(ids);
    };

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="flex flex-col gap-4 rounded-3xl bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campfire-100">
                            <HugeiconsIcon icon={ChartIcon} size={26} className="text-campfire-600" />
                        </div>
                        <div>
                            <h1 className="font-baskerville text-2xl font-bold text-cloud-600">Dashboard</h1>
                            <p className="text-sm text-neutral-500">Uso da plataforma e administração do gestor</p>
                        </div>
                    </div>
                </div>

                <LoadingGroup>
                    <div className="flex flex-col gap-10">
                        <UsageStatsSection onPromote={handlePromoteClick} />

                        <div className="bg-white rounded-3xl p-6">
                            <VisualKeyboard onEdit={handleEditConfig} canManage />
                        </div>

                        <PromotionSection canReview />

                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-cloud-400">
                                Administração
                            </p>
                            <CategorySection />
                            <GlossaryDisciplineSection />
                        </div>
                    </div>
                </LoadingGroup>
            </section>

            {/* Modal de edição de configuração de mão */}
            <Modal open={editModal} onClose={handleEditClose}>
                <HandConfigForm
                    handConfig={editingConfig ?? undefined}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                />
            </Modal>

            {/* Modal de promoção de sinal */}
            <PromoteSignModal
                open={promoteModal.open}
                onClose={() => setPromoteModal({ open: false })}
                onConfirm={handlePromoteConfirm}
                loading={promoting}
                signName={promoteModal.name}
            />
        </>
    );
};

export default DashboardPage;
