import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Home from '../pages/home'
import LoginPage from '../pages/auth/login'
import RegisterPage from '../pages/auth/register'

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
        ],
    },
]

export const router = createBrowserRouter(routes)
