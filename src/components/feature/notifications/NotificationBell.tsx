import { useLocation, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BellDotIcon, Notification01Icon } from "@hugeicons/core-free-icons";

import { useNotifications } from "./useNotifications";

interface NotificationBellProps {
    className: string;
}

// Sino que leva à tela de notificações; o estilo do botão vem de quem usa
export const NotificationBell = ({ className }: NotificationBellProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { data: notifications = [] } = useNotifications();
    // Na própria tela, tudo já conta como visto
    const unread = pathname === "/notifications" ? 0 : notifications.filter((n) => !n.readAt).length;

    return (
        <button
            type="button"
            onClick={() => navigate("/notifications")}
            aria-label={unread > 0 ? `Notificações: ${unread} não lidas` : "Notificações"}
            className={`relative ${className}`}
        >
            <HugeiconsIcon icon={unread > 0 ? BellDotIcon : Notification01Icon} size={22} />
        </button>
    );
};

export default NotificationBell;
