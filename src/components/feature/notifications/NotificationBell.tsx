import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";

import { useNotifications } from "./useNotifications";

interface NotificationBellProps {
    onOpen: () => void;
    className: string;
}

// Sino com o contador de não lidas; o estilo do botão vem de quem usa
export const NotificationBell = ({ onOpen, className }: NotificationBellProps) => {
    const { data: notifications = [] } = useNotifications();
    const unread = notifications.filter((n) => !n.readAt).length;

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={unread > 0 ? `Notificações: ${unread} não lidas` : "Notificações"}
            className={`relative ${className}`}
        >
            <HugeiconsIcon icon={Notification03Icon} size={22} />
            {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-salmon-500 px-1 text-[11px] font-semibold text-white">
                    {unread > 9 ? "9+" : unread}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;
