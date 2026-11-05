import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Notification03Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { DeleteRequest, PatchRequest } from "@requests";
import { NOTIFICATIONS } from "@routes/notifications";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import { useNotifications, type NotificationItem } from "./useNotifications";

interface NotificationsModalProps {
    open: boolean;
    onClose: () => void;
}

const TONE_DOT: Record<NotificationItem["tone"], string> = {
    success: "bg-lime-500",
    danger: "bg-salmon-500",
    info: "bg-sky-500",
};

const formatDate = (date: string) =>
    new Date(date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const NotificationsModal = ({ open, onClose }: NotificationsModalProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: notifications = [], isPending } = useNotifications();

    const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });

    const { mutate: markAllRead } = useMutation({
        mutationFn: () => unwrap(PatchRequest(NOTIFICATIONS.READ_ALL(), {})),
    });

    const { mutate: remove } = useMutation({
        mutationFn: (id: string) => unwrap(DeleteRequest(NOTIFICATIONS.REMOVE(id))),
        onSuccess: refresh,
        onError: () => toast.error("Não foi possível apagar a notificação"),
    });

    const { mutate: removeAll, isPending: removingAll } = useMutation({
        mutationFn: () => unwrap(DeleteRequest(NOTIFICATIONS.ALL())),
        onSuccess: refresh,
        onError: () => toast.error("Não foi possível apagar as notificações"),
    });

    // Abrir conta como ler. O destaque continua até fechar, para mostrar o que é novo
    function markReadOnOpen() {
        if (open && notifications.some((n) => !n.readAt)) markAllRead();
    }

    function close() {
        refresh();
        onClose();
    }

    useEffect(() => { markReadOnOpen(); }, [open]);

    function openLink(link: string) {
        close();
        navigate(link);
    }

    return (
        <Modal open={open} onClose={close} size="lg">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3 pr-10">
                    <h2 className="font-baskerville text-2xl font-semibold text-cloud-600">Notificações</h2>
                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={() => removeAll()}
                            disabled={removingAll}
                            className="cursor-pointer text-sm font-semibold text-cloud-500/80 hover:text-cloud-500 disabled:opacity-50"
                        >
                            Apagar todas
                        </button>
                    )}
                </div>

                {isPending ? (
                    <div className="flex justify-center py-10"><Spinner /></div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center text-cloud-500/70">
                        <HugeiconsIcon icon={Notification03Icon} size={32} />
                        <p className="text-sm">Você não tem notificações.</p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {notifications.map((n) => (
                            <li key={n.id} className={`flex gap-3 rounded-2xl p-4 ${n.readAt ? "bg-cloud-100" : "bg-campfire-100"}`}>
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[n.tone]}`} />
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <p className="font-semibold text-cloud-600">{n.title}</p>
                                    <p className="text-sm leading-relaxed text-cloud-500">{n.message}</p>
                                    {n.reason && (
                                        <p className="text-sm leading-relaxed text-cloud-600">
                                            <span className="font-semibold">Motivo:</span> {n.reason}
                                        </p>
                                    )}
                                    <div className="mt-1 flex items-center gap-3 text-xs text-cloud-500/70">
                                        <span>{formatDate(n.createdAt)}</span>
                                        {n.link && (
                                            <button
                                                type="button"
                                                onClick={() => openLink(n.link!)}
                                                className="cursor-pointer font-semibold text-campfire-600 hover:text-campfire-500"
                                            >
                                                Abrir
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(n.id)}
                                    aria-label={`Apagar notificação: ${n.title}`}
                                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-cloud-500/70 transition-colors hover:bg-white hover:text-salmon-600"
                                >
                                    <HugeiconsIcon icon={Delete02Icon} size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
};

export default NotificationsModal;
