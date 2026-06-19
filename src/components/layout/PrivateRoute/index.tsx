import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
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

    return <Outlet />
}

export default PrivateRoute
