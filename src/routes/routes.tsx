import { Suspense, lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import PageLoader from '@components/layout/PageLoader'

// Todas as rotas são carregadas sob demanda (code-splitting): quem abre a
// landing ou o repositório público não baixa o código da área logada, e
// vice-versa. Importante para o uso em celular dentro da sala de aula.

// Publico
const Home = lazy(() => import('@pages/home'))
const PublicGlossaryPage = lazy(() => import('@pages/public-glossary'))

// Auth
const LoginPage = lazy(() => import('@pages/auth/login'))
const RegisterPage = lazy(() => import('@pages/auth/register'))
const PendingPage = lazy(() => import('@pages/pending'))

// App
const MainLayout = lazy(() => import('@pages/main-layout'))
const PrivateRoute = lazy(() => import('@/components/layout/PrivateRoute'))
const ClassroomsPage = lazy(() => import('@/pages/classrooms'))
const ClassroomDetailPage = lazy(() => import('@/pages/classroom-detail'))
const FavoritesPage = lazy(() => import('@/pages/favorites'))
const HistoryPage = lazy(() => import('@/pages/history'))
const ProfilePage = lazy(() => import('@/pages/profile'))
const SignDetailPage = lazy(() => import('@/pages/sign-detail'))
const SearchResultsPage = lazy(() => import('@/pages/search'))
const GlossaryPage = lazy(() => import('@/pages/glossary'))
const WorkspacePage = lazy(() => import('@/pages/workspace'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const EducatorsPage = lazy(() => import('@/pages/educators'))
const MembersPage = lazy(() => import('@/pages/members'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

// Envolve o elemento da rota no Suspense que exibe o loader durante o download
const suspended = (Component: LazyExoticComponent<ComponentType>) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
)

const routes: RouteObject[] = [
    {
        path: '/',
        element: suspended(Home),
    },
    {
        // Repositório público — glossário aberto, sem autenticação
        path: '/public-glossary',
        element: suspended(PublicGlossaryPage),
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                element: suspended(LoginPage),
            },
            {
                path: 'register',
                element: suspended(RegisterPage),
            },
        ],
    },
    {
        path: '/pending',
        element: suspended(PendingPage),
    },
    {
        path: '/',
        element: suspended(PrivateRoute),
        children: [
            {
                element: suspended(MainLayout),
                children: [
                    {
                        path: 'classrooms',
                        element: suspended(ClassroomsPage),
                    },
                    {
                        path: 'classrooms/:id',
                        element: suspended(ClassroomDetailPage),
                    },
                    {
                        path: 'signs/:id',
                        element: suspended(SignDetailPage),
                    },
                    {
                        path: 'workspace',
                        element: suspended(WorkspacePage),
                    },
                    {
                        path: 'dashboard',
                        element: suspended(DashboardPage),
                    },
                    {
                        path: 'educators',
                        element: suspended(EducatorsPage),
                    },
                    {
                        path: 'members',
                        element: suspended(MembersPage),
                    },
                    {
                        path: 'search',
                        element: suspended(SearchResultsPage),
                    },
                    {
                        path: 'glossary',
                        element: suspended(GlossaryPage),
                    },
                    {
                        path: 'favorites',
                        element: suspended(FavoritesPage),
                    },
                    {
                        path: 'history',
                        element: suspended(HistoryPage),
                    },
                    {
                        path: 'profile',
                        element: suspended(ProfilePage),
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: suspended(NotFoundPage),
    },
]

export const router = createBrowserRouter(routes)
