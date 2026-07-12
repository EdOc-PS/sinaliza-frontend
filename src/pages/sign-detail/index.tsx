import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteRequest, GetRequest, PostRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { FAVORITES } from "@routes/favorites";
import { HISTORY } from "@routes/history";
import { SEARCH } from "@routes/search";
import { useAuth } from "@context/AuthContext";

import Spinner from "@components/ui/Spinner";
import Modal from "@components/ui/Modal";
import ConfirmDeleteModal from "@components/layout/ConfirmDeleteModal";
import { SignForm } from "@components/feature/workspace/SignForm";
import { VisualKeyboard, type HandConfigTypeForm } from "@components/feature/workspace/VisualKeyboard";
import { SignCard, type SignCardData } from "@components/feature/classroom-detail/SignCard";
import { EmptyImage } from "@components/feature/sign-detail/EmptyImage";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/youtube/youtube";
import { getCategoryBadgeClass, type CategorySlim } from "@lib/constants/category";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChevronLeft,
    ChevronRight,
    DeleteIcon,
    Edit02Icon,
    FavouriteIcon,
    HandPointingLeft02Icon,
    RotateRight01Icon,
    SignLanguageCIcon,
    SpeechIcon,
} from "@hugeicons/core-free-icons";

interface SignDetail {
    id: string;
    name: string;
    category?: CategorySlim | null;
    handConfigId: string;
    videoUrl?: string | null;
    anotherUrl?: string | null;
    imgUrl?: string | null;
    examplePt?: string | null;
    exampleLibras?: string | null;
    movementDescription?: string | null;
    tags: string[];
    creatorId: string;
    handConfig?: { id: string; name: string; imgUrl?: string | null } | null;
    disciplines?: { id: string; name: string }[] | null;
}

const SignDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [sign, setSign] = useState<SignDetail | null>(null);
    const [related, setRelated] = useState<SignCardData[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateScrollButtons = () => {
        const el = carouselRef.current;
        if (!el) return;
        // margem de 4px para evitar falsos positivos por arredondamento
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    const scrollCarousel = (direction: "prev" | "next") => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
    };

    const loadSign = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [signRes, favRes] = await Promise.all([
                GetRequest<SignDetail>(SIGNS.FIND_ONE(id)),
                GetRequest<SignCardData[]>(FAVORITES.ALL()),
            ]);

            if (!signRes.success) {
                toast.error("Falha ao carregar o sinal: " + signRes.message);
                return;
            }
            setSign(signRes.object ?? null);
            setIsFavorite((favRes.object ?? []).some((s) => s.id === id));

            // Registra o acesso no histórico (não bloqueia a tela em caso de falha)
            PostRequest(HISTORY.REGISTER(id), {}).catch(() => { });

            // Sinais semelhantes (não bloqueia a tela em caso de falha)
            loadRelated(id);
        } finally {
            setLoading(false);
        }
    };

    const loadRelated = async (signId: string) => {
        const res = await GetRequest<SignCardData[]>(SEARCH.RELATED(signId));
        setRelated(res.object ?? []);
    };

    const handleSelectHandConfig = (config: HandConfigTypeForm) => {
        if (!config.id) return;
        navigate(`/search?handConfigId=${config.id}`);
    };

    const handleToggleFavorite = async () => {
        if (!id) return;
        setFavLoading(true);
        try {
            const res = isFavorite
                ? await DeleteRequest(FAVORITES.REMOVE(id))
                : await PostRequest(FAVORITES.ADD(id), {});
            if (!res.success) { toast.error("Falha ao atualizar favorito: " + res.message); return; }
            setIsFavorite((prev) => !prev);
            toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
        } finally {
            setFavLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            const res = await DeleteRequest(SIGNS.DELETE(id));
            if (!res.success) { toast.error("Falha ao excluir sinal: " + res.message); return; }
            toast.success("Sinal excluído com sucesso!");
            navigate(-1);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        loadSign();
    }, [id]);

    // Recalcula as setas do carrossel quando os relacionados carregam e ao redimensionar
    useEffect(() => {
        updateScrollButtons();
        window.addEventListener("resize", updateScrollButtons);
        return () => window.removeEventListener("resize", updateScrollButtons);
    }, [related]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={32} color="#6B7280" />
            </div>
        );
    }

    if (!sign) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-lg font-semibold text-cloud-500">Sinal não encontrado</p>
                <button onClick={() => navigate(-1)} className="text-sm text-campfire-500 hover:underline">
                    Voltar
                </button>
            </div>
        );
    }

    const canManage = !!user?.roles?.includes("EDUCATOR") && sign.creatorId === user?.id;
    const categoryClass = getCategoryBadgeClass(sign.category?.value);
    const youTubeId = sign.anotherUrl ? getYouTubeId(sign.anotherUrl) : null;

    return (
        <>
            <section className="flex flex-col gap-6">
                {/* Voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 self-start rounded-2xl bg-cloud-100 hover:bg-cloud-200 transition-colors px-3 py-1.5 text-sm font-medium text-cloud-600"
                >
                    <HugeiconsIcon icon={HandPointingLeft02Icon} size={18} />
                    Voltar
                </button>

                {/* Área principal: player + cards laterais */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    {/* Player */}
                    <div className="lg:col-span-3 overflow-hidden rounded-3xl bg-black aspect-video">
                        {youTubeId ? (
                            <iframe
                                className="h-full w-full"
                                src={getYouTubeEmbedUrl(youTubeId)}
                                title={sign.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : sign.videoUrl ? (
                            <video controls className="h-full w-full object-contain" src={sign.videoUrl} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-white/60 text-sm">
                                Vídeo não disponível.
                            </div>
                        )}
                    </div>

                    {/* Cards laterais: imagem do sinal + configuração de mão */}
                    <div className="flex flex-col gap-4">
                        {/* Imagem cadastrada — proporção mais larga que alta */}
                        <div className="aspect-video overflow-hidden rounded-3xl bg-cloud-100 flex items-center justify-center">
                            {sign.imgUrl ? (
                                <img src={sign.imgUrl} alt={sign.name} className="h-full w-full object-cover" />
                            ) : (
                                <EmptyImage iconSize={28} />
                            )}
                        </div>

                        {/* Configuração de mão */}
                        <div className="flex flex-col gap-3 rounded-3xl bg-white p-4">
                            <span className="text-sm font-semibold text-cloud-600">Configuração de mão</span>
                            <div className="flex items-center gap-3">
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cloud-100">
                                    {sign.handConfig?.imgUrl ? (
                                        <img src={sign.handConfig.imgUrl} alt={sign.handConfig.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <EmptyImage iconSize={24} label="" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-cloud-500">
                                    {sign.handConfig?.name ?? "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Título + badge + ações */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-cloud-600">
                                {sign.name}
                            </h1>
                            {sign.category && (
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${categoryClass}`}>
                                    {sign.category.name}
                                </span>
                            )}
                        </div>
                        {sign.disciplines && sign.disciplines.length > 0 && (
                            <span className="text-xs text-neutral-400">
                                {sign.disciplines.map((d) => d.name).join(" · ")}
                            </span>
                        )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleFavorite}
                            disabled={favLoading}
                            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
                                isFavorite
                                    ? "bg-salmon-100 text-salmon-600 hover:bg-salmon-200"
                                    : "bg-cloud-100 text-cloud-600 hover:bg-cloud-200"
                            }`}
                        >
                            <HugeiconsIcon
                                icon={FavouriteIcon}
                                size={18}
                                className={isFavorite ? "fill-salmon-500" : ""}
                            />
                            {isFavorite ? "Favoritado" : "Favoritar"}
                        </button>

                        {canManage && (
                            <>
                                <button
                                    onClick={() => setEditModal(true)}
                                    className="flex items-center gap-2 rounded-2xl bg-cloud-100 hover:bg-cloud-200 transition-colors px-3.5 py-2 text-sm font-medium text-cloud-600"
                                >
                                    <HugeiconsIcon icon={Edit02Icon} size={18} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => setDeleteModal(true)}
                                    className="flex items-center gap-2 rounded-2xl bg-salmon-100 hover:bg-salmon-200 transition-colors px-3.5 py-2 text-sm font-medium text-salmon-600"
                                >
                                    <HugeiconsIcon icon={DeleteIcon} size={18} />
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Cards de descrição do movimento e exemplos */}
                {(sign.movementDescription || sign.exampleLibras || sign.examplePt) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                        <div className="flex flex-col gap-2 rounded-3xl bg-white p-5 h-full">
                            <div className="flex items-center gap-2 text-salmon-500">
                                <HugeiconsIcon icon={RotateRight01Icon} size={18} />
                                <span className="text-sm font-semibold">Descrição do movimento</span>
                            </div>
                            <p className="text-sm text-cloud-600 leading-relaxed">
                                {sign.movementDescription || "—"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 rounded-3xl bg-white p-5">
                                <div className="flex items-center gap-2 text-campfire-500">
                                    <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                                    <span className="text-sm font-semibold">Exemplo em Libras</span>
                                </div>
                                <p className="text-sm text-cloud-600 leading-relaxed">
                                    {sign.exampleLibras || "—"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-3xl bg-white p-5">
                                <div className="flex items-center gap-2 text-sky-500">
                                    <HugeiconsIcon icon={SpeechIcon} size={18} />
                                    <span className="text-sm font-semibold">Exemplo em Português</span>
                                </div>
                                <p className="text-sm text-cloud-600 leading-relaxed">
                                    {sign.examplePt || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sinais semelhantes (carrossel) */}
                {related.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-baskerville text-xl text-cloud-500">Sinais semelhantes</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollCarousel("prev")}
                                    disabled={!canPrev}
                                    className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-200 transition-all"
                                >
                                    <HugeiconsIcon icon={ChevronLeft} size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollCarousel("next")}
                                    disabled={!canNext}
                                    className="p-1.5 rounded-xl border-2 border-neutral-200 text-cloud-700 hover:border-cloud-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-200 transition-all"
                                >
                                    <HugeiconsIcon icon={ChevronRight} size={18} />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={carouselRef}
                            onScroll={updateScrollButtons}
                            className="flex gap-5 overflow-x-hidden pb-2 -mx-1 px-1"
                        >
                            {related.map((item) => (
                                <div key={item.id} className="w-64 shrink-0">
                                    <SignCard sign={item} onClick={() => navigate(`/signs/${item.id}`)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Teclado visual — clicar numa configuração busca sinais com ela */}
                <div className="rounded-3xl bg-white p-6">
                    <VisualKeyboard
                        onSelectConfig={handleSelectHandConfig}
                        title="Buscar por configuração de mão"
                        subtitle="Clique em uma configuração para encontrar sinais parecidos"
                    />
                </div>
            </section>

            {/* Modal de editar sinal */}
            <Modal open={editModal} onClose={() => setEditModal(false)} size="2xl">
                <SignForm
                    signId={sign.id}
                    onClose={() => setEditModal(false)}
                    onSuccess={() => { setEditModal(false); loadSign(); }}
                />
            </Modal>

            {/* Modal de confirmar exclusão */}
            <ConfirmDeleteModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                loading={deleting}
                title={<>Excluir <span className="text-salmon-600 italic">Sinal</span>?</>}
                description={
                    <>
                        O sinal{" "}
                        <span className="font-semibold text-salmon-600 italic">{sign.name}</span>{" "}
                        será removido permanentemente. Esta ação não pode ser desfeita.
                    </>
                }
                confirmText="Excluir sinal"
            />
        </>
    );
};

export default SignDetailPage;
