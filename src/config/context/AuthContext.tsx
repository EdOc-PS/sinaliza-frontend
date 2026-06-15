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

const TOKEN_KEY = '@token'

// ─────────────────────────────────────────────
// Tipos do contexto
// ─────────────────────────────────────────────

type AuthContextValue = {
    user: User | null
    login: (credentials: LoginPayload) => Promise<void>
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

    // Busca o usuário autenticado a partir do token salvo
    async function getUser() {
        const token = localStorage.getItem(TOKEN_KEY)

        if (!token) {
            setUser(null)
            return
        }

        try {
            const response = await GetRequest<User>(AUTH.ME())

            if (response.success && response.object) {
                setUser(response.object)
            } else {
                // Token inválido ou sessão expirada
                localStorage.removeItem(TOKEN_KEY)
                setUser(null)
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            setUser(null)
        }
    }

    // Autentica o usuário e salva o token
    async function login(credentials: LoginPayload) {
        const response = await PostRequest<LoginResponse>(AUTH.LOGIN(), credentials)

        if (!response.success || !response.object) {
            throw new Error(response.message || 'Falha ao autenticar.')
        }

        const { access_token, user } = response.object
        localStorage.setItem(TOKEN_KEY, access_token)
        setUser(user)
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
    }

    // Ao montar, tenta recuperar a sessão existente
    useEffect(() => {
        getUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, getUser }}>
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
