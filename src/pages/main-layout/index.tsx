import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon } from "@hugeicons/core-free-icons"

import MenuNavigation from "@components/layout/MenuNavigation"
import MobileHeader from "@components/layout/MobileHeader"
import { Tooltip } from "@components/ui/Tooltip"
import { FAB } from "@components/layout/FAB"
import { OnboardingModal } from "@components/feature/onboarding/OnboardingModal"

import { FABProvider } from "@context/FABContext"
import { useAuth } from "@context/AuthContext"

const MainLayout = () => {
    const { user } = useAuth()
    const [onboardingOpen, setOnboardingOpen] = useState(false)

    // Primeiro login: abre o tour sozinho. Depois só pelo botão de ajuda.
    useEffect(() => {
        if (user && !user.onboardingSeenAt) setOnboardingOpen(true)
    }, [user])

    return (
        <FABProvider>
            <MobileHeader onOpenHelp={() => setOnboardingOpen(true)} />
            <MenuNavigation />

            <main className="relative lg:ml-20 min-h-screen pb-28 lg:pb-10">
                {/* Botão de ajuda flutua no canto — não ocupa uma faixa própria,
                    então o conteúdo começa logo no topo da página */}
                <div className="hidden lg:block absolute right-10 top-5 z-20">
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

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 lg:pt-5 lg:pb-10">
                    <Outlet />
                </div>
            </main>

            <FAB />
            <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
        </FABProvider>
    )
}

export default MainLayout
