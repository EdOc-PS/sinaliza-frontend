import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar03Icon,
    Cancel01Icon,
    Clock01Icon,
    Delete02Icon,
    Rotate01Icon,
    SignLanguageCIcon,
    ViewIcon,
} from "@hugeicons/core-free-icons";

import { DeleteRequest, GetRequest } from "@requests";
import { HISTORY } from "@routes/history";

import Spinner from "@components/ui/Spinner";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";

interface HistorySign extends SignCardData {
    accessedAt: string;
}

interface HistoryGroup {
    label: string;
    signs: HistorySign[];
}

// Início do dia (00:00) de uma data
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// Rótulo amigável da data ("Hoje", "Ontem" ou "8 de junho")
const dateLabel = (date: Date): string => {
    const today = startOfDay(new Date());
    const day = startOfDay(date);
    const diffDays = Math.round((today - day) / 86_400_000);

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
};

// Tempo relativo do último acesso ("agora há pouco", "há 2h", "há 3 dias")
const relativeTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 5) return "agora há pouco";
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days} ${days === 1 ? "dia" : "dias"}`;
};

const HistoryPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [signs, setSigns] = useState<HistorySign[]>([]);
    const [clearModal, setClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const res = await GetRequest<HistorySign[]>(HISTORY.ALL());
            if (!res.success) { toast.error("Falha ao carregar histórico: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (signId: string) => {
        const res = await DeleteRequest(HISTORY.REMOVE(signId));
        if (!res.success) { toast.error("Falha ao remover do histórico: " + res.message); return; }
        setSigns((prev) => prev.filter((s) => s.id !== signId));
        toast.success("Sinal removido do histórico");
    };

    const handleClear = async () => {
        setClearing(true);
        try {
            const res = await DeleteRequest(HISTORY.CLEAR());
            if (!res.success) { toast.error("Falha ao limpar histórico: " + res.message); return; }
            setSigns([]);
            setClearModal(false);
            toast.success("Histórico limpo com sucesso");
        } finally {
            setClearing(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    // Agrupa os sinais por dia, preservando a ordem (mais recente primeiro)
    const groups = useMemo<HistoryGroup[]>(() => {
        const result: HistoryGroup[] = [];
        let currentKey: number | null = null;

        for (const sign of signs) {
            const key = startOfDay(new Date(sign.accessedAt));
            if (key !== currentKey) {
                result.push({ label: dateLabel(new Date(sign.accessedAt)), signs: [] });
                currentKey = key;
            }
            result[result.length - 1].signs.push(sign);
        }
        return result;
    }, [signs]);

    const distinctDays = groups.length;
    const lastAccess = signs[0]?.accessedAt;

    return (
        <section className="flex flex-col gap-8">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-sky-100">
                <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8" style={{ minHeight: 200 }}>
                    {/* Ícone */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/20 ">
                        <HugeiconsIcon icon={Rotate01Icon} size={28} className="text-sky-600" />
                    </div>

                    {/* Título + descrição */}
                    <div>
                        <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-cloud-600">
                            Histórico de sinais
                        </h1>
                        <p className="mt-1.5 max-w-lg text-sm text-cloud-400">
                            Tudo o que você acessou recentemente. Volte rapidamente aos sinais com que esteve trabalhando.
                        </p>
                    </div>

                    {/* Meta */}
                    {!loading && signs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cloud-500">
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={ViewIcon} size={18} className="text-sky-500" />
                                <span><b className="text-cloud-600">{signs.length}</b> interações</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={Calendar03Icon} size={18} className="text-sky-500" />
                                <span><b className="text-cloud-600">{distinctDays}</b> {distinctDays === 1 ? "dia" : "dias"}</span>
                            </div>
                            {lastAccess && (
                                <div className="flex items-center gap-1.5">
                                    <HugeiconsIcon icon={Clock01Icon} size={18} className="text-sky-500" />
                                    <span>Última: {relativeTime(lastAccess)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Conteúdo */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={32} color="#6B7280" />
                </div>
            ) : signs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                    <HugeiconsIcon icon={SignLanguageCIcon} size={40} className="text-cloud-300" />
                    <div>
                        <p className="text-sm font-medium text-cloud-500">Nenhum sinal no histórico</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Os sinais que você acessar aparecerão aqui.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Botão de limpar histórico */}
                    <div className="flex items-center justify-between">
                        <h2 className="font-baskerville text-xl text-cloud-500">Acessados recentemente</h2>
                        <button
                            onClick={() => setClearModal(true)}
                            className="flex items-center gap-2 rounded-2xl bg-salmon-100 hover:bg-salmon-200 transition-colors px-3.5 py-2 text-sm font-medium text-salmon-600"
                        >
                            <HugeiconsIcon icon={Delete02Icon} size={18} />
                            Limpar histórico
                        </button>
                    </div>

                    {/* Grupos por data */}
                    {groups.map((group) => (
                        <div key={group.label} className="flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-cloud-500">
                                    {group.label}
                                </span>
                                <div className="h-px flex-1 bg-cloud-200" />
                                <span className="rounded-full bg-cloud-100 px-2.5 py-0.5 text-xs text-neutral-400">
                                    {group.signs.length} {group.signs.length === 1 ? "sinal" : "sinais"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {group.signs.map((sign) => (
                                    <SignCard
                                        key={sign.id}
                                        sign={sign}
                                        onClick={() => navigate(`/signs/${sign.id}`)}
                                        actions={[
                                            {
                                                label: "Remover do histórico",
                                                icon: Cancel01Icon,
                                                onSelect: () => handleRemove(sign.id),
                                            },
                                        ]}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmar limpeza */}
            <ConfirmDeleteModal
                open={clearModal}
                onClose={() => setClearModal(false)}
                onConfirm={handleClear}
                loading={clearing}
                title={<>Limpar <span className="text-salmon-600 italic">Histórico</span>?</>}
                description={
                    <>
                        Todos os {signs.length} sinais do seu histórico serão removidos.
                        Esta ação não pode ser desfeita.
                    </>
                }
                confirmText="Limpar histórico"
                loadingText="Limpando..."
            />
        </section>
    );
};

export default HistoryPage;
