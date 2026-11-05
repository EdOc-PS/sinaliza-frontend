import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon } from "@hugeicons/core-free-icons"

import MenuNavigation from "@components/layout/MenuNavigation"
import MobileHeader from "@components/layout/MobileHeader"
import { Tooltip } from "@components/ui/Tooltip"
import { FAB } from "@components/layout/FAB"
import { OnboardingModal } from "@components/feature/onboarding/OnboardingModal"

import { NotificationBell } from "@components/feature/notifications/NotificationBell"
import { NotificationsModal } from "@components/feature/notifications/NotificationsModal"

import { FABProvider } from "@context/FABContext"
import { useAuth } from "@context/AuthContext"

const MainLayout = () => {
    const { user } = useAuth()
    const [onboardingOpen, setOnboardingOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    // Primeiro login: abre o tour sozinho. Depois só pelo botão de ajuda.
    useEffect(() => {
        if (user && (!user.onboardingSeenAt || user.mustChangePassword)) setOnboardingOpen(true)
    }, [user])

    // Senha temporária: a API recusa o resto, então só o tour é carregado até a troca.
    // O modal fica na mesma posição da árvore para não reiniciar o tour depois da troca.
    const locked = !!user?.mustChangePassword

    return (
        <FABProvider>
            {!locked && (
                <>
            <MobileHeader onOpenHelp={() => setOnboardingOpen(true)} onOpenNotifications={() => setNotificationsOpen(true)} />
            <MenuNavigation />

            <main className="relative md:ml-16 xl:ml-20 min-h-screen pb-28 md:pb-10">
                {/* Botão de ajuda flutua no canto — não ocupa uma faixa própria,
                    então o conteúdo começa logo no topo da página */}
                <div className="hidden md:flex items-center gap-2 absolute right-10 top-5 z-20">
                    <NotificationBell
                        onOpen={() => setNotificationsOpen(true)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-cloud-500 shadow-lg shadow-cloud-500/20 ring-2 ring-cloud-400/10 transition-colors hover:bg-cloud-100 hover:text-cloud-700"
                    />
                    <Tooltip label="Como usar a plataforma" position="right">
                        <button
                            type="button"
                            onClick={() => setOnboardingOpen(true)}
                            aria-label="Ajuda: como usar a plataforma"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-cloud-500 shadow-lg shadow-cloud-500/20 ring-2 ring-cloud-400/10 transition-colors hover:bg-cloud-100 hover:text-cloud-700"
                        >
                            <HugeiconsIcon icon={HelpCircleIcon} size={22} />
                        </button>
                    </Tooltip>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 md:pt-5 md:pb-10">
                    <Outlet />
                </div>
            </main>

            <FAB />
                </>
            )}
            <NotificationsModal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
            <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
        </FABProvider>
    )
}

export default MainLayout
