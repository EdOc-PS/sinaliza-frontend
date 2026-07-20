import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, FavouriteIcon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import Spinner from "@components/ui/Spinner";

interface ListCardProps {
    title: string;
    icon: typeof FavouriteIcon;
    iconClass: string;
    onSeeAll: () => void;
    loading: boolean;
    empty: boolean;
    emptyText: string;
    children: React.ReactNode;
}

// Cartão de lista do perfil — usado em "Últimos acessados" e "Últimas curtidas"
export const ListCard = ({ title, icon, iconClass, onSeeAll, loading, empty, emptyText, children }: ListCardProps) => (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
                    <HugeiconsIcon icon={icon} size={18} />
                </div>
                <h2 className="font-baskerville text-lg font-bold text-cloud-600">{title}</h2>
            </div>
            <button
                onClick={onSeeAll}
                className="flex items-center gap-1 text-sm font-medium text-cloud-400 hover:text-cloud-600 transition-colors"
            >
                Ver tudo
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-10">
                <Spinner size={24} color="#6B7280" />
            </div>
        ) : empty ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <HugeiconsIcon icon={SignLanguageCIcon} size={28} className="text-cloud-300" />
                <p className="text-xs text-neutral-400">{emptyText}</p>
            </div>
        ) : (
            <div className="flex flex-col gap-1">{children}</div>
        )}
    </div>
);
