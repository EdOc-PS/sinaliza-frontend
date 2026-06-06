import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// Publico
import Home from '@pages/home'

// Auth
import LoginPage from '@pages/auth/login'
import RegisterPage from '@pages/auth/register'

// App
import MainLayout from '@pages/main-layout'
import ClassroomsPage from '@/pages/classrooms'
import ClassroomDetailPage from '@/pages/classroom-detail'
import WorkspacePage from '@/pages/workspace'

// 404
const NotFoundPage = () => <div className="flex items-center justify-center h-screen text-2xl">Página não encontrada (404)</div>

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
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'classrooms',
                element: <ClassroomsPage />,
            },
            {
                path: 'classrooms/:id',
                element: <ClassroomDetailPage />,
            },
            {
                path: 'workspace',
                element: <WorkspacePage />,
            },
            {
                path: 'glossary',
                element: <ClassroomsPage />,
            },
            {
                path: 'favorites',
                element: <ClassroomsPage />,
            },
            {
                path: 'history',
                element: <ClassroomsPage />,
            },
            {
                path: 'profile',
                element: <ClassroomsPage />,
            }
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]

export const router = createBrowserRouter(routes)
