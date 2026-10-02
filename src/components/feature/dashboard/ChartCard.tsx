import type { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export const ChartCard = ({ title, subtitle, children, className = "" }: ChartCardProps) => (
    <div className={`flex min-w-0 flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6 ${className}`}>
        <div>
            <h3 className="font-baskerville text-lg font-bold text-cloud-600">{title}</h3>
            {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {children}
    </div>
);

export default ChartCard;
