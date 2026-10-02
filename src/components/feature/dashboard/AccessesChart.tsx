import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE } from "./types";

const formatDay = (iso: string) => {
    const [, month, day] = iso.split("-");
    return `${day}/${month}`;
};

export const AccessesChart = ({ data }: { data: { date: string; total: number }[] }) => {
    const total = data.reduce((sum, d) => sum + d.total, 0);

    if (total === 0) {
        return (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-cloud-300 px-4 text-center text-sm text-neutral-400">
                Ainda sem acessos registrados nos últimos 30 dias.
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="accessFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS.lime} stopOpacity={0.45} />
                            <stop offset="100%" stopColor={CHART_COLORS.lime} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDay}
                        tick={{ fontSize: 11, fill: CHART_COLORS.cloudSoft }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        minTickGap={24}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: CHART_COLORS.cloudSoft }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        labelFormatter={(label) => formatDay(String(label))}
                        formatter={(value) => [`${value} acesso${Number(value) === 1 ? "" : "s"}`, ""]}
                        separator=""
                        contentStyle={TOOLTIP_STYLE}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke={CHART_COLORS.limeStrong}
                        strokeWidth={2.5}
                        fill="url(#accessFill)"
                        activeDot={{ r: 5, fill: CHART_COLORS.limeStrong, stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AccessesChart;
