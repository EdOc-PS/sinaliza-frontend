import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowRight01Icon,
    Calendar03Icon,
    Edit02Icon,
    FavouriteIcon,
    Mail01Icon,
    Rotate01Icon,
    SchoolIcon,
    SignLanguageCIcon,
} from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { FAVORITES } from "@routes/favorites";
import { HISTORY } from "@routes/history";
import { useAuth } from "@context/AuthContext";

import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import { RoleBadge } from "@components/ui/RoleBadge";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { EditAccountForm } from "@components/feature/profile/EditAccountForm";
import { SignListItem, type SignListData } from "@components/feature/profile/SignListItem";

interface HistorySign extends SignListData {
    accessedAt: string;
}

const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [editModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistorySign[]>([]);
    const [favorites, setFavorites] = useState<SignListData[]>([]);

    const loadLists = async () => {
        setLoading(true);
        try {
            const [historyRes, favoritesRes] = await Promise.all([
                GetRequest<HistorySign[]>(HISTORY.ALL()),
                GetRequest<SignListData[]>(FAVORITES.ALL()),
            ]);
            setHistory(historyRes.object ?? []);
            setFavorites(favoritesRes.object ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLists();
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={32} color="#6B7280" />
            </div>
        );
    }

    const joinedAt = new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

    return (
        <>
            <section className="flex flex-col gap-8">
                {/* Cartão de perfil */}
                <div className="overflow-hidden rounded-3xl bg-white">
                    {/* Banner */}
                    <div className="relative h-40 sm:h-48">
                        <CardMemphisBackground seed={user.id} color="#213547" rounded="rounded-none" />
                        <button
                            onClick={() => setEditModal(true)}
                            className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 text-sm font-medium text-white"
                        >
                            <HugeiconsIcon icon={Edit02Icon} size={18} />
                            Editar conta
                        </button>
                    </div>

                    {/* Cabeçalho */}
                    <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                        {/* Avatar */}
                        <div className="absolute right-6 top-0 h-24 w-24 -translate-y-1/2 shrink-0 sm:right-8 sm:h-28 sm:w-28">
                            <div className="flex h-full w-full items-center justify-center rounded-3xl border-4 border-white bg-campfire-100 font-baskerville text-3xl font-bold text-campfire-600 shadow-sm">
                                {initials(user.name)}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            {/* Identidade */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex flex-col gap-1 pt-14 sm:pr-32 sm:pt-0">
                                    <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-cloud-600">
                                        {user.name}
                                    </h1>
                                    {user.institution?.name && (
                                        <span className="flex items-center gap-1.5 text-sm text-neutral-400">
                                            <HugeiconsIcon icon={SchoolIcon} size={15} />
                                            {user.institution.name}
                                        </span>
                                    )}

                                    {/* Badges de role — usuário pode ter mais de uma */}
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        {user.roles.map((role) => (
                                            <RoleBadge key={role} role={role} educatorType={user.educatorType} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cloud-500">
                                {user.bio}
                            </p>
                        )}

                        {/* Meta */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-neutral-400">
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={Calendar03Icon} size={16} />
                                <span>Entrou em {joinedAt}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={Mail01Icon} size={16} />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listas: últimos acessados + últimas curtidas */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Últimos acessados */}
                    <ListCard
                        title="Últimos acessados"
                        icon={Rotate01Icon}
                        iconClass="bg-sky-100 text-sky-600"
                        onSeeAll={() => navigate("/history")}
                        loading={loading}
                        empty={history.length === 0}
                        emptyText="Nenhum sinal acessado ainda."
                    >
                        {history.slice(0, 4).map((sign) => (
                            <SignListItem
                                key={sign.id}
                                sign={sign}
                                onClick={() => navigate(`/signs/${sign.id}`)}
                                meta={new Date(sign.accessedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            />
                        ))}
                    </ListCard>

                    {/* Últimas curtidas */}
                    <ListCard
                        title="Últimas curtidas"
                        icon={FavouriteIcon}
                        iconClass="bg-salmon-100 text-salmon-600"
                        onSeeAll={() => navigate("/favorites")}
                        loading={loading}
                        empty={favorites.length === 0}
                        emptyText="Nenhum sinal favoritado ainda."
                    >
                        {favorites.slice(0, 4).map((sign) => (
                            <SignListItem
                                key={sign.id}
                                sign={sign}
                                onClick={() => navigate(`/signs/${sign.id}`)}
                            />
                        ))}
                    </ListCard>
                </div>
            </section>

            {/* Modal de editar conta */}
            <Modal open={editModal} onClose={() => setEditModal(false)}>
                <EditAccountForm
                    onClose={() => setEditModal(false)}
                    onSuccess={() => setEditModal(false)}
                />
            </Modal>
        </>
    );
};

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

const ListCard = ({ title, icon, iconClass, onSeeAll, loading, empty, emptyText, children }: ListCardProps) => (
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

export default ProfilePage;
