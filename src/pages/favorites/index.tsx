import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Search01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { FAVORITES } from "@routes/favorites";

import Input from "@components/ui/Input";
import Spinner from "@components/ui/Spinner";
import { SignCard, type SignCardData } from "@/components/feature/classroom-detail/SignCard";

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [signs, setSigns] = useState<SignCardData[]>([]);
    const [query, setQuery] = useState("");

    const filtered = query.trim()
        ? signs.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
        : signs;

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const res = await GetRequest<SignCardData[]>(FAVORITES.ALL());
            if (!res.success) { toast.error("Falha ao carregar favoritos: " + res.message); return; }
            setSigns(res.object ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    return (
        <section className="flex flex-col gap-8">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-salmon-100">
                <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8" style={{ minHeight: 200 }}>
                    {/* Ícone */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-salmon-400/20 ">
                        <HugeiconsIcon icon={FavouriteIcon} size={28} className="text-salmon-600" />
                    </div>

                    {/* Título + descrição */}
                    <div>
                        <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-cloud-600">
                            Meus favoritos
                        </h1>
                        <p className="mt-1.5 max-w-lg text-sm text-cloud-400">
                            Os sinais que você salvou para acessar rapidamente. Reúna aqui os sinais que mais usa em sala de aula.
                        </p>
                    </div>

                    {/* Meta */}
                    {!loading && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-cloud-500">
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={FavouriteIcon} size={18} className="text-salmon-500" />
                                <span><b className="text-cloud-600">{signs.length}</b> sinais favoritados</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={SignLanguageCIcon} size={18} className="text-salmon-500" />
                                <span>
                                    <b className="text-cloud-600">
                                        {new Set(signs.map((s) => s.category?.value).filter(Boolean)).size}
                                    </b> categorias
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Conteúdo */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={32} color="#6B7280" />
                </div>
            ) : signs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                    <HugeiconsIcon icon={FavouriteIcon} size={40} className="text-cloud-300" />
                    <div>
                        <p className="text-sm font-medium text-cloud-500">Nenhum favorito ainda</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Favorite sinais nas disciplinas para encontrá-los aqui.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-baskerville text-xl text-cloud-500">Sinais salvos</h2>

                        {/* Busca dentro dos favoritos */}
                        <div className="w-full sm:max-w-xs">
                            <Input
                                icon={Search01Icon}
                                value={query}
                                onChange={(value) => setQuery(value)}
                                placeholder="Buscar nos favoritos..."
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-cloud-300 py-16 text-center">
                            <HugeiconsIcon icon={Search01Icon} size={32} className="text-cloud-300" />
                            <p className="text-sm font-medium text-cloud-500">Nenhum sinal encontrado</p>
                            <p className="text-xs text-neutral-400">
                                Nenhum favorito corresponde a "<b className="text-cloud-500">{query}</b>".
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((sign) => (
                                <SignCard
                                    key={sign.id}
                                    sign={sign}
                                    isFavorite
                                    onClick={() => navigate(`/signs/${sign.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default FavoritesPage;
