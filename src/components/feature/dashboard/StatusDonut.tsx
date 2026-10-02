import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE, type GlobalStatus } from "./types";

const STATUS_META: Record<GlobalStatus, { label: string; color: string }> = {
    PUBLIC: { label: "Públicos no glossário", color: CHART_COLORS.lime },
    PENDING: { label: "Aguardando aprovação", color: CHART_COLORS.sunflower },
    PRIVATE: { label: "Só nas turmas", color: CHART_COLORS.cloud },
    REJECTED: { label: "Promoção recusada", color: CHART_COLORS.salmon },
};

export const StatusDonut = ({ data }: { data: { status: GlobalStatus; total: number }[] }) => {
    const total = data.reduce((sum, d) => sum + d.total, 0);
    const slices = data.filter((d) => d.total > 0);

    return (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={slices}
                            dataKey="total"
                            nameKey="status"
                            innerRadius="62%"
                            outerRadius="100%"
                            paddingAngle={slices.length > 1 ? 2 : 0}
                            stroke="none"
                        >
                            {slices.map((d) => (
                                <Cell key={d.status} fill={STATUS_META[d.status].color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [String(value), STATUS_META[name as GlobalStatus]?.label ?? String(name)]}
                            contentStyle={TOOLTIP_STYLE}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-baskerville text-2xl font-bold tabular-nums text-cloud-600">{total}</span>
                    <span className="text-xs text-neutral-400">sinais</span>
                </div>
            </div>

            <ul className="flex w-full flex-col gap-2">
                {data.map((d) => (
                    <li key={d.status} className="flex items-center gap-2.5 text-sm">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: STATUS_META[d.status].color }} />
                        <span className="flex-1 text-cloud-500">{STATUS_META[d.status].label}</span>
                        <span className="font-semibold tabular-nums text-cloud-600">{d.total}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatusDonut;
