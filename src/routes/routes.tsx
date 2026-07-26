import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// Publico
import Home from '@pages/home'
import PublicGlossaryPage from '@pages/public-glossary'

// Auth
import LoginPage from '@pages/auth/login'
import RegisterPage from '@pages/auth/register'

// App
import MainLayout from '@pages/main-layout'
import PrivateRoute from '@/components/layout/PrivateRoute'
import ClassroomsPage from '@/pages/classrooms'
import ClassroomDetailPage from '@/pages/classroom-detail'
import FavoritesPage from '@/pages/favorites'
import HistoryPage from '@/pages/history'
import ProfilePage from '@/pages/profile'
import SignDetailPage from '@/pages/sign-detail'
import SearchResultsPage from '@/pages/search'
import GlossaryPage from '@/pages/glossary'
import WorkspacePage from '@/pages/workspace'
import EducatorsPage from '@/pages/educators'
import MembersPage from '@/pages/members'
import PendingPage from '@/pages/pending'
import NotFoundPage from '@/pages/not-found'

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        // Repositório público — glossário aberto, sem autenticação
        path: '/public-glossary',
        element: <PublicGlossaryPage />,
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
        path: '/pending',
        element: <PendingPage />,
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
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
                        path: 'signs/:id',
                        element: <SignDetailPage />,
                    },
                    {
                        path: 'workspace',
                        element: <WorkspacePage />,
                    },
                    {
                        path: 'educators',
                        element: <EducatorsPage />,
                    },
                    {
                        path: 'members',
                        element: <MembersPage />,
                    },
                    {
                        path: 'search',
                        element: <SearchResultsPage />,
                    },
                    {
                        path: 'glossary',
                        element: <GlossaryPage />,
                    },
                    {
                        path: 'favorites',
                        element: <FavoritesPage />,
                    },
                    {
                        path: 'history',
                        element: <HistoryPage />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]

export const router = createBrowserRouter(routes)
