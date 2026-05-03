import { useAuth } from "@context/AuthContext"

import { useEffect } from "react"

const ClassroomsPage = () => {
    const { user, getUser } = useAuth()

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log('Usuário atual:', user)
    }, [user])

    return (
        <section>
            <h1>Página de Teste</h1>
            <hr />
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </section>
    )
}

export default ClassroomsPage
