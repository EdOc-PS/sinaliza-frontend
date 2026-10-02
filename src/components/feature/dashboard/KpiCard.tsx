import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface KpiCardProps {
    icon: IconSvgElement;
    label: string;
    value: number;
    hint?: string;
    /** Classes de fundo + texto do ícone, ex: "bg-lime-100 text-lime-700" */
    tone: string;
}

export const KpiCard = ({ icon, label, value, hint, tone }: KpiCardProps) => (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-5">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}>
            <HugeiconsIcon icon={icon} size={20} />
        </span>
        <div>
            <p className="font-baskerville text-3xl font-bold tabular-nums text-cloud-600">
                {value.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm font-medium text-cloud-500">{label}</p>
            {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
        </div>
    </div>
);

export default KpiCard;
