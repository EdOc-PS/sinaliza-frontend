import { useAuth } from "@/config/context/AuthContext"
import { useEffect } from "react"

const TestePage = () => {
    const { user, getUser } = useAuth()

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log('Usuário atual:', user)
    }, [user])

    return (
        <div>
            <h1>Página de Teste</h1>
            <hr />
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

export default TestePage
