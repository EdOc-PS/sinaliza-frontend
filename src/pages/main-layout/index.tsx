import MenuNavigation from "@components/layout/MenuNavigation"
import MobileHeader from "@components/layout/MobileHeader"
import TopSearchBar from "@components/layout/TopSearchBar"
import { FAB } from "@components/layout/FAB"

import { FABProvider } from "@context/FABContext"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    return (
        <FABProvider>
            <MobileHeader />
            <MenuNavigation />

            <main className="lg:ml-20 min-h-screen pb-28 lg:pb-10">
                {/* Barra de busca fixa no topo (estilo e-commerce) */}
                <div className="sticky top-0 z-30 bg-transparent backdrop-blur-sm pb-3">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
                        <TopSearchBar />
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 lg:pb-10">
                    <Outlet />
                </div>
            </main>

            <FAB />
        </FABProvider>
    )
}

export default MainLayout
