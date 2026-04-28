import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Home from '@pages/home'
import LoginPage from '@pages/auth/login'
import RegisterPage from '@pages/auth/register'
import TestePage from '@pages/teste'

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
       {
        path: '/teste',
        element: <TestePage />,
    },
]

export const router = createBrowserRouter(routes)
