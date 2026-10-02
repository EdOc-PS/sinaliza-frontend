import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChartIcon,
    GlobalEducationIcon,
    SignLanguageCIcon,
    StudentsIcon,
    Time01Icon,
    UserMultiple02Icon,
    ViewIcon,
} from "@hugeicons/core-free-icons";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { GetRequest, PatchRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { DASHBOARD } from "@routes/dashboard";

import Modal from "@components/ui/Modal";
import { HandConfigForm } from "@components/feature/workspace/HandConfigForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";
import { GlossaryDisciplineSection } from "@components/feature/workspace/GlossaryDisciplineSection";
import { CategorySection } from "@components/feature/workspace/CategorySection";
import { PromotionSection } from "@components/feature/workspace/PromotionSection";
import PromoteSignModal from "@components/feature/workspace/PromoteSignModal";
import { SignUsageSection } from "@components/feature/dashboard/SignUsageSection";
import { KpiCard } from "@components/feature/dashboard/KpiCard";
import { ChartCard } from "@components/feature/dashboard/ChartCard";
import { AccessesChart } from "@components/feature/dashboard/AccessesChart";
import { StatusDonut } from "@components/feature/dashboard/StatusDonut";
import { CategoryBars } from "@components/feature/dashboard/CategoryBars";
import { PromotionCandidates } from "@components/feature/dashboard/PromotionCandidates";
import type { DashboardOverview, PromotionCandidate } from "@components/feature/dashboard/types";

import { LoadingGroup, useReportLoading } from "@lib/hooks/useLoadingGroup";

const SectionLabel = ({ children }: { children: string }) => (
    <p className="text-xs font-semibold uppercase tracking-wide text-cloud-400">{children}</p>
);

interface OverviewSectionProps {
    onPromote: (sign: PromotionCandidate) => void;
}

// Componente próprio só para o report de loading acontecer dentro da árvore
// do LoadingGroup (o hook precisa rodar num descendente do Provider, não no
// componente que o declara) — assim entra no mesmo spinner único da página.
const OverviewSection = ({ onPromote }: OverviewSectionProps) => {
    const { data, isPending } = useQuery({
        queryKey: queryKeys.dashboard.overview(),
        queryFn: () => unwrap(GetRequest<DashboardOverview>(DASHBOARD.OVERVIEW())),
        meta: { errorMessage: "Falha ao carregar o dashboard" },
    });
    useReportLoading("dashboard-overview", isPending);

    if (!data) return null;
    const { kpis } = data;

    return (
        <div className="flex flex-col gap-10">
            {/* Indicadores */}
            <div className="flex flex-col gap-4">
                <SectionLabel>Visão geral</SectionLabel>
                <div className="stagger-children grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    <KpiCard icon={SignLanguageCIcon} label="Sinais" value={kpis.totalSigns} tone="bg-cloud-200 text-cloud-600" />
                    <KpiCard icon={GlobalEducationIcon} label="No glossário" value={kpis.publicSigns} tone="bg-lime-100 text-lime-700" />
                    <KpiCard icon={Time01Icon} label="Pendentes" value={kpis.pendingSigns} hint="aguardando você" tone="bg-sunflower-100 text-sunflower-700" />
                    <KpiCard icon={ViewIcon} label="Acessos" value={kpis.accessesLast30d} hint="últimos 30 dias" tone="bg-sky-100 text-sky-700" />
                    <KpiCard icon={StudentsIcon} label="Alunos" value={kpis.students} hint={`${kpis.educators} educadores`} tone="bg-campfire-100 text-campfire-700" />
                    <KpiCard icon={UserMultiple02Icon} label="Ativos" value={kpis.activeUsers7d} hint="usuários em 7 dias" tone="bg-salmon-100 text-salmon-700" />
                </div>
            </div>

            {/* Gráficos */}
            <div className="flex flex-col gap-4">
                <SectionLabel>Uso da plataforma</SectionLabel>
                <ChartCard title="Acessos a sinais" subtitle="Visualizações por dia nos últimos 30 dias">
                    <AccessesChart data={data.accessesByDay} />
                </ChartCard>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartCard title="Sinais por situação" subtitle="Onde cada sinal está no caminho até o glossário">
                        <StatusDonut data={data.signsByStatus} />
                    </ChartCard>
                    <ChartCard title="Sinais por categoria">
                        <CategoryBars data={data.signsByCategory} />
                    </ChartCard>
                </div>
            </div>

            {/* Candidatos + mais acessados */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
                <ChartCard
                    title="Candidatos à promoção"
                    subtitle="Sinais fora do glossário com mais acessos e favoritos"
                >
                    <PromotionCandidates candidates={data.promotionCandidates} onPromote={onPromote} />
                </ChartCard>
                <ChartCard title="Mais acessados" subtitle="Todos os sinais, por total de acessos">
                    <SignUsageSection signs={data.topSigns} title="Top 8" />
                </ChartCard>
            </div>
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
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.signs.promotions() });
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const handlePromoteClick = (sign: PromotionCandidate) => setPromoteModal({ open: true, signId: sign.id, name: sign.name });
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
                        <OverviewSection onPromote={handlePromoteClick} />

                        <PromotionSection canReview />

                        <div className="flex flex-col gap-4">
                            <SectionLabel>Administração</SectionLabel>
                            <div className="bg-white rounded-3xl p-6">
                                <VisualKeyboard onEdit={handleEditConfig} canManage />
                            </div>
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
