import type { CategorySlim } from "@lib/constants/category";
import type { SignUsage } from "./SignUsageSection";

export type GlobalStatus = "PRIVATE" | "PENDING" | "PUBLIC" | "REJECTED";

export interface PromotionCandidate extends SignUsage {
    favoriteCount: number;
    score: number;
    creatorName: string | null;
    classrooms: { id: string; name: string }[];
    category?: CategorySlim | null;
}

export interface DashboardOverview {
    kpis: {
        totalSigns: number;
        publicSigns: number;
        pendingSigns: number;
        students: number;
        educators: number;
        accessesLast30d: number;
        activeUsers7d: number;
    };
    accessesByDay: { date: string; total: number }[];
    signsByStatus: { status: GlobalStatus; total: number }[];
    signsByCategory: { category: string; total: number }[];
    topSigns: (SignUsage & { favoriteCount: number })[];
    promotionCandidates: PromotionCandidate[];
}

// Mesmos hex do tema Tailwind (src/index.css) — o Recharts precisa de cor literal
export const CHART_COLORS = {
    lime: "#BACA57",
    limeStrong: "#96AA30",
    sunflower: "#EFB832",
    cloud: "#213547",
    cloudSoft: "#95A6BD",
    salmon: "#EEA2A2",
    sky: "#56B2D4",
    grid: "#E6EEF5",
} as const;

export const TOOLTIP_STYLE = { borderRadius: 12, border: `1px solid ${CHART_COLORS.grid}`, fontSize: 12 };
