import { HugeiconsIcon } from "@hugeicons/react";
import { BellDotIcon, Notification03Icon } from "@hugeicons/core-free-icons";

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
            <HugeiconsIcon icon={unread > 0 ? BellDotIcon : Notification03Icon} size={22} />
        </button>
    );
};

export default NotificationBell;
