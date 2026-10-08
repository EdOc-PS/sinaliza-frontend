import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
    GetRequest,
    PatchRequest,
    PostRequest,
    type User,
    type LoginPayload,
    type LoginResponse,
    type RegisterPayload,
    type UpdateUserPayload,
} from '@api/requests'
import { AUTH } from '@routes/auth'
import { USERS } from '@routes/users'
import { queryClient } from '@/config/query/queryClient'

const TOKEN_KEY = '@token'
const RETRY_ME_DELAY_MS = 5000

// ─────────────────────────────────────────────
// Tipos do contexto
// ─────────────────────────────────────────────

type AuthContextValue = {
    user: User | null
    initialized: boolean
    login: (credentials: LoginPayload) => Promise<User>
    register: (data: RegisterPayload) => Promise<void>
    updateUser: (data: UpdateUserPayload) => Promise<void>
    logout: () => void
    getUser: () => Promise<void>
}

// ─────────────────────────────────────────────
// Criação do contexto
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [initialized, setInitialized] = useState(false)

    // Busca o usuário autenticado a partir do token salvo
    async function getUser() {
        const token = localStorage.getItem(TOKEN_KEY)

        if (!token) {
            setUser(null)
            setInitialized(true)
            return
        }

        try {
            const response = await GetRequest<User>(AUTH.ME())

            // Login feito enquanto o /auth/me ainda carregava (servidor acordando):
            // esta resposta é do token antigo e não pode sobrescrever a sessão nova
            if (localStorage.getItem(TOKEN_KEY) !== token) return

            if (response.success && response.object) {
                setUser(response.object)
            } else if (!localStorage.getItem(TOKEN_KEY)) {
                // handleError só limpa o storage em 401 de sessão: token inválido de verdade
                setUser(null)
            } else {
                // Falha de rede/502/500 (servidor acordando ou fora do ar): o token
                // continua válido, então não desloga — tenta de novo mantendo o loading
                setTimeout(retryGetUser, RETRY_ME_DELAY_MS)
                return
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            if (localStorage.getItem(TOKEN_KEY) === token) {
                setTimeout(retryGetUser, RETRY_ME_DELAY_MS)
                return
            }
        }
        setInitialized(true)
    }

    function retryGetUser() {
        getUser()
    }

    // Autentica o usuário e salva o token
    async function login(credentials: LoginPayload) {
        // Descarta o token antigo antes de logar: senão um /auth/me lento desse
        // token (servidor acordando) volta 401 no meio do login, o client.ts vê
        // que é o token salvo e recarrega a página em /auth/login
        localStorage.removeItem(TOKEN_KEY)

        const response = await PostRequest<LoginResponse>(AUTH.LOGIN(), credentials)

        if (!response.success || !response.object) {
            throw new Error(response.message || 'Falha ao autenticar.')
        }

        const { access_token, user } = response.object
        localStorage.setItem(TOKEN_KEY, access_token)
        setUser(user)
        // O getUser do token antigo sai sem marcar initialized; sem isso a
        // PrivateRoute ficaria presa no spinner
        setInitialized(true)
        return user
    }

    // Cria uma nova conta (não autentica automaticamente)
    async function register(data: RegisterPayload) {
        const response = await PostRequest<User>(AUTH.REGISTER(), data)

        if (!response.success) {
            throw new Error(response.message || 'Erro ao criar conta.')
        }
    }

    // Atualiza os dados do usuário autenticado e sincroniza o contexto
    async function updateUser(data: UpdateUserPayload) {
        if (!user) throw new Error('Nenhum usuário autenticado.')

        const response = await PatchRequest<User>(USERS.UPDATE(user.id), data)

        if (!response.success) {
            throw new Error(response.message || 'Erro ao atualizar conta.')
        }

        await getUser()
    }

    // Remove o token e limpa o usuário
    function logout() {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        // Sem isso, o cache do usuário anterior (turmas, favoritos, etc.) sobrevive
        // no navegador e aparece pro próximo que logar nessa mesma aba.
        queryClient.clear()
    }

    // Ao montar, tenta recuperar a sessão existente
    useEffect(() => {
        getUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, initialized, login, register, updateUser, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// ─────────────────────────────────────────────
// Hook de consumo
// ─────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
    }
    return context
}
