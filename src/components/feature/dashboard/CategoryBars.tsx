import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE } from "./types";

export const CategoryBars = ({ data }: { data: { category: string; total: number }[] }) => {
    if (data.length === 0) {
        return (
            <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-cloud-300 text-sm text-neutral-400">
                Nenhum sinal cadastrado ainda.
            </div>
        );
    }

    // Altura acompanha a quantidade de categorias para as barras não espremerem
    const height = Math.max(176, data.length * 38);

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: CHART_COLORS.cloudSoft }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        width={96}
                        tick={{ fontSize: 12, fill: CHART_COLORS.cloud }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: CHART_COLORS.grid, opacity: 0.6 }}
                        formatter={(value) => [`${value} sina${Number(value) === 1 ? "l" : "is"}`, ""]}
                        separator=""
                        contentStyle={TOOLTIP_STYLE}
                    />
                    <Bar dataKey="total" fill={CHART_COLORS.sky} radius={[0, 8, 8, 0]} barSize={18} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryBars;
