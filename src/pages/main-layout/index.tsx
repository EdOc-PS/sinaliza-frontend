import MenuNavigation from "@components/layout/MenuNavigation"
import MobileHeader from "@components/layout/MobileHeader"

import { useAuth } from "@context/AuthContext"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    const { user, getUser } = useAuth()

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log('Usuário atual:', user)
    }, [user])

    return (
        <>
        <MobileHeader />
        <MenuNavigation />
 
        <main className="lg:ml-20 min-h-screen pb-28 lg:pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-10">
                <Outlet />
            </div>
        </main>
        </>

    )
}

export default MainLayout
