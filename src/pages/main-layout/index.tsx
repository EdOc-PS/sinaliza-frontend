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
 
        <main className="mx-auto max-w-5xl px-8 py-2 lg:py-10 lg:px-10">
             <Outlet />
        </main>
        </>

    )
}

export default MainLayout
