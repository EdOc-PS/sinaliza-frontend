import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight } from "@hugeicons/core-free-icons";

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    /** Texto exibido à esquerda, ex: "12 aluno(s)" */
    label?: string;
}

// Mesmo padrão de setas usado no teclado de mão (HandConfigPicker/VisualKeyboard)
export const Pagination = ({ page, totalPages, onChange, label }: PaginationProps) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-neutral-400">{label}</span>
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 text-cloud-500 hover:border-cloud-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <HugeiconsIcon icon={ChevronLeft} size={16} />
            </button>
            <span className="text-xs font-semibold text-cloud-500 min-w-9 text-center">
                {page}/{totalPages}
            </span>
            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-2xl border-2 border-cloud-400/10 bg-cloud-100 text-cloud-500 hover:border-cloud-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <HugeiconsIcon icon={ChevronRight} size={16} />
            </button>
        </div>
    </div>
);

export default Pagination;
