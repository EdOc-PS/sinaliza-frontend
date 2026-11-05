import { useQuery } from "@tanstack/react-query";

import { GetRequest } from "@requests";
import { NOTIFICATIONS } from "@routes/notifications";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";

export interface NotificationItem {
    id: string;
    tone: "success" | "danger" | "info";
    title: string;
    message: string;
    reason: string | null;
    link: string | null;
    readAt: string | null;
    createdAt: string;
}

const REFRESH_MS = 60_000;

// Atualiza sozinho para o contador do sino não depender de recarregar a página
export function useNotifications() {
    return useQuery({
        queryKey: queryKeys.notifications.list(),
        queryFn: () => unwrap(GetRequest<NotificationItem[]>(NOTIFICATIONS.ALL())),
        refetchInterval: REFRESH_MS,
    });
}
