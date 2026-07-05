import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { isPendingApproval } from '@lib/auth/approval'
import Spinner from '@components/ui/Spinner'

const PrivateRoute = () => {
    const { user, initialized } = useAuth()

    if (!initialized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner size={36} />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />
    }

    // Contas pendentes/recusadas não acessam o app — vão para a tela de análise
    if (isPendingApproval(user)) {
        return <Navigate to="/pending" replace />
    }

    return <Outlet />
}

export default PrivateRoute
