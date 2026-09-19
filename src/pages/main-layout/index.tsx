import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon } from "@hugeicons/core-free-icons"

import MenuNavigation from "@components/layout/MenuNavigation"
import MobileHeader from "@components/layout/MobileHeader"
import TopSearchBar from "@components/layout/TopSearchBar"
import { Tooltip } from "@components/ui/Tooltip"
import { FAB } from "@components/layout/FAB"
import { OnboardingModal } from "@components/feature/onboarding/OnboardingModal"

import { FABProvider } from "@context/FABContext"
import { useAuth } from "@context/AuthContext"

const MainLayout = () => {
    const { user } = useAuth()
    const [onboardingOpen, setOnboardingOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    // Primeiro login: abre o tour sozinho. Depois só pelo botão de ajuda.
    useEffect(() => {
        if (user && !user.onboardingSeenAt) setOnboardingOpen(true)
    }, [user])

    return (
        <FABProvider>
            <MobileHeader
                searchOpen={searchOpen}
                onToggleSearch={() => setSearchOpen((v) => !v)}
                onOpenHelp={() => setOnboardingOpen(true)}
            />
            <MenuNavigation />

            <main className="lg:ml-20 min-h-screen pb-28 lg:pb-10">
                {/* Barra de busca fixa no topo (estilo e-commerce). Mesma largura do banner
                    abaixo (mesmo container/padding) — o botão de ajuda flutua por cima do
                    canto direito em vez de empurrar a busca para dentro. */}
                <div className="sticky top-0 z-30 bg-transparent backdrop-blur-sm pb-3">
                    <div className="relative py-3">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
                            <TopSearchBar open={searchOpen} onOpenChange={setSearchOpen} />
                        </div>
                        <Tooltip
                            label="Como usar a plataforma"
                            position="right"
                            className="hidden lg:block absolute top-1/2 right-5 lg:right-10 -translate-y-1/2"
                        >
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
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 lg:pb-10">
                    <Outlet />
                </div>
            </main>

            <FAB />
            <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
        </FABProvider>
    )
}

export default MainLayout
