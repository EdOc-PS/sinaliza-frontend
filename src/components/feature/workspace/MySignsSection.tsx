import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import { getCategoryBadgeClass, type CategorySlim } from "@lib/constants/category";
import { useReportLoading } from "@lib/hooks/useLoadingGroup";

import Input from "@components/ui/Input";
import Pagination from "@components/ui/Pagination";
import { SignThumb } from "@components/feature/dashboard/SignUsageSection";

type GlobalStatus = "PRIVATE" | "PENDING" | "PUBLIC" | "REJECTED";

interface MySign {
    id: string;
    name: string;
    slug: string;
    videoUrl?: string | null;
    anotherUrl?: string | null;
    imgUrl?: string | null;
    globalStatus: GlobalStatus;
    createdAt: string;
    category?: CategorySlim | null;
    classrooms: { id: string; name: string }[];
}

const STATUS_BADGE: Record<GlobalStatus, { label: string; className: string }> = {
    PRIVATE:  { label: "Só nas turmas", className: "bg-cloud-200 text-cloud-600" },
    PENDING:  { label: "Aguardando aprovação", className: "bg-sunflower-100 text-sunflower-700" },
    PUBLIC:   { label: "No glossário", className: "bg-lime-100 text-lime-700" },
    REJECTED: { label: "Promoção recusada", className: "bg-salmon-100 text-salmon-700" },
};

const ITEMS_PER_PAGE = 6;

// Lista dos sinais criados pelo educador logado — só os dele, não os da turma
export const MySignsSection = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data: signs = [], isPending } = useQuery({
        queryKey: queryKeys.signs.mine(),
        queryFn: () => unwrap(GetRequest<MySign[]>(SIGNS.MINE())),
        meta: { errorMessage: "Falha ao carregar seus sinais" },
    });
    useReportLoading("my-signs", isPending);

    const term = search.trim().toLowerCase();
    const filtered = term ? signs.filter((s) => s.name.toLowerCase().includes(term)) : signs;
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-5 rounded-3xl bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                        <HugeiconsIcon icon={SignLanguageCIcon} size={24} className="text-sky-700" />
                    </div>
                    <div>
                        <h2 className="font-baskerville text-lg text-cloud-500">Meus sinais</h2>
                        <p className="text-sm text-neutral-500">Sinais que você cadastrou, em todas as suas turmas</p>
                    </div>
                </div>
                {signs.length > 0 && (
                    <div className="sm:w-80 lg:w-96">
                        <Input icon={Search01Icon} value={search} onChange={handleSearch} placeholder="Buscar nos meus sinais..." />
                    </div>
                )}
            </div>

            {signs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-10 text-center">
                    <HugeiconsIcon icon={SignLanguageCIcon} size={32} className="text-cloud-300" />
                    <p className="text-sm text-neutral-500">Você ainda não cadastrou nenhum sinal.</p>
                    <p className="text-xs text-neutral-400">Use "Criar novo sinal" acima para começar.</p>
                </div>
            ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-neutral-500">Nenhum sinal seu corresponde a "{search.trim()}".</p>
            ) : (
                <div className="flex flex-col gap-3">
                    <ul className="flex flex-col gap-2">
                        {paginated.map((sign) => {
                            const status = STATUS_BADGE[sign.globalStatus];
                            return (
                                <li
                                    key={sign.id}
                                    onClick={() => navigate(`/signs/${sign.slug}`)}
                                    className="flex cursor-pointer items-center gap-3 rounded-2xl bg-cloud-100/60 p-3 transition-colors hover:bg-cloud-100"
                                >
                                    <SignThumb sign={sign} />
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="truncate text-sm font-semibold text-cloud-600">{sign.name}</span>
                                            {sign.category && (
                                                <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(sign.category.value)}`}>
                                                    {sign.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <span className="truncate text-xs text-neutral-500">
                                            {sign.classrooms.length > 0
                                                ? sign.classrooms.map((c) => c.name).join(" · ")
                                                : "Sem turma"}
                                        </span>
                                    </div>
                                    <span className={`hidden shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold sm:inline ${status.className}`}>
                                        {status.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        onChange={setPage}
                        label={`${filtered.length} sina${filtered.length === 1 ? "l" : "is"}`}
                    />
                </div>
            )}
        </div>
    );
};

export default MySignsSection;
