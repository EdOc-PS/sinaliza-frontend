import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellDotIcon, Delete02Icon, Notification01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { DeleteRequest, PatchRequest } from "@requests";
import { NOTIFICATIONS } from "@routes/notifications";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import Button from "@components/ui/Button";
import Spinner from "@components/ui/Spinner";
import { CardMemphisBackground } from "@components/feature/classroom/CardMemphisBackground";
import { useNotifications, type NotificationItem } from "@components/feature/notifications/useNotifications";

// Confete de sinos
const NOTIFICATION_ICONS = [Notification01Icon, Notification01Icon, Notification01Icon, BellDotIcon, BellDotIcon, StarIcon];

const TONE_DOT: Record<NotificationItem["tone"], string> = {
    success: "bg-lime-500",
    danger: "bg-salmon-500",
    info: "bg-sky-500",
};

const formatDate = (date: string) =>
    new Date(date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const NotificationsPage = () => {
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

    const { mutate: decide, isPending: deciding } = useMutation({
        mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
            unwrap(PatchRequest(NOTIFICATIONS.PASSWORD_REQUEST(id), { approve })),
        onSuccess: (_data, { approve }) => {
            toast.success(approve ? "Pedido aprovado" : "Pedido recusado");
            refresh();
        },
        onError: (err: Error) => {
            toast.error(err.message);
            refresh();
        },
    });

    const hasUnread = notifications.some((n) => !n.readAt);

    // Abrir conta como ler. O destaque continua até sair da tela, para mostrar o que é novo
    function markReadOnOpen() {
        if (hasUnread) markAllRead();
    }

    function refreshOnLeave() {
        return () => { refresh(); };
    }

    useEffect(() => { markReadOnOpen(); }, [hasUnread]);
    useEffect(() => refreshOnLeave(), []);

    return (
        <section className="flex flex-col gap-6">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-3xl">
                <CardMemphisBackground seed="notifications" color="#E6AB6E" rounded="rounded-3xl" icons={NOTIFICATION_ICONS} />
                <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8" style={{ minHeight: 200 }}>
                    <div className="flex items-start justify-between gap-3">
                        {/* Ícone */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                            <HugeiconsIcon icon={Notification01Icon} size={28} className="text-white" />
                        </div>
                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={() => removeAll()}
                                disabled={removingAll}
                                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:opacity-50"
                            >
                                <HugeiconsIcon icon={Delete02Icon} size={18} />
                                Apagar todas
                            </button>
                        )}
                    </div>

                    {/* Título + descrição */}
                    <div>
                        <h1 className="font-baskerville text-2xl font-semibold text-white sm:text-3xl">Notificações</h1>
                        <p className="mt-1.5 max-w-lg text-sm text-white/85">
                            Avisos sobre suas turmas, seus sinais e sua conta, tudo em um só lugar.
                        </p>
                    </div>
                </div>
            </div>

            {isPending ? (
                <div className="flex justify-center py-10"><Spinner /></div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-3xl bg-white py-14 text-center text-cloud-500/70">
                    <HugeiconsIcon icon={Notification01Icon} size={32} />
                    <p className="text-sm">Você não tem notificações.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {notifications.map((n) => (
                        <li key={n.id} className={`flex gap-3 rounded-2xl p-4 sm:p-5 ${n.readAt ? "bg-white" : "bg-campfire-100"}`}>
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[n.tone]}`} />
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className="font-semibold text-cloud-600">{n.title}</p>
                                <p className="text-sm leading-relaxed text-cloud-500">{n.message}</p>
                                {n.reason && (
                                    <p className="text-sm leading-relaxed text-cloud-600">
                                        <span className="font-semibold">Motivo:</span> {n.reason}
                                    </p>
                                )}

                                {n.passwordRequest?.status === "PENDING" && (
                                    <div className="mt-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            disabled={deciding}
                                            onClick={() => decide({ id: n.passwordRequest!.id, approve: true })}
                                        >
                                            Aprovar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={deciding}
                                            onClick={() => decide({ id: n.passwordRequest!.id, approve: false })}
                                        >
                                            Recusar
                                        </Button>
                                    </div>
                                )}
                                {n.passwordRequest && n.passwordRequest.status !== "PENDING" && (
                                    <p className="text-sm font-semibold text-cloud-500">
                                        {n.passwordRequest.status === "APPROVED" ? "Pedido aprovado" : "Pedido recusado"}
                                    </p>
                                )}

                                <div className="mt-1 flex items-center gap-3 text-xs text-cloud-500/70">
                                    <span>{formatDate(n.createdAt)}</span>
                                    {n.link && (
                                        <button
                                            type="button"
                                            onClick={() => navigate(n.link!)}
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
                                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-cloud-500/70 transition-colors hover:bg-cloud-100 hover:text-salmon-600"
                            >
                                <HugeiconsIcon icon={Delete02Icon} size={18} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default NotificationsPage;
