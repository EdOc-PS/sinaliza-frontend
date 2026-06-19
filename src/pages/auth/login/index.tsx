import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthBackground from '@/components/layout/AuthBackground'
import Input from '@components/ui/Input'
import Label from '@components/ui/Label'
import Button from '@components/ui/Button'
import { CirclePasswordIcon, MailOpenLoveIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { useAuth } from '@/config/context/AuthContext'

interface AuthProps {
    email: string
    password: string
}

const LoginPage = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [auth, setAuth] = useState<AuthProps>({
        email: '',
        password: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(auth.email.trim())

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true)
        try {
            await login({ email: auth.email, password: auth.password })
            toast.success('Login realizado com sucesso!')
            navigate('/classrooms')
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
            <AuthBackground />
            <div className='flex flex-col items-center w-full'>
                {/* Logo */}
                <div className='flex items-center'>
                    <img src="/src/assets/images/logo/logo-simples.png" alt="Logo do Sinaliza" className='w-20 h-20 sm:w-20 sm:h-20' />
                    <h1 className='text-2xl sm:text-3xl font-bold text-cloud-500'>sinaliza</h1>
                </div>

                {/* Formulário de Login */}
                <div className="w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 border-2 border-neutral-300">
                    <div className="space-y-6">
                        <div className='flex w-full justify-center'>
                            <img src="/src/assets/images/sun.png" alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                        </div>

                        <div className="text-center">
                            <p className="text-2xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                                Olá, <span className="text-campfire-500 font-baskerville">Bem vindo!</span>
                            </p>
                            <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                Entre na sua conta para continuar
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">E-mail:</Label>
                                <Input
                                    id="email"
                                    icon={MailOpenLoveIcon}
                                    placeholder="usuario@exemplo.com"
                                    value={auth.email}
                                    onChange={(value) => setAuth({ ...auth, email: value })}
                                />
                                {auth.email.trim() !== '' && !emailValido && (
                                    <p className="text-xs text-neutral-400 pl-1">
                                        Digite um e-mail válido.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Sua Senha:</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    icon={CirclePasswordIcon}
                                    placeholder="Sua melhor senha"
                                    value={auth.password}
                                    onChange={(value) => setAuth({ ...auth, password: value })}
                                />
                                <p className="text-end text-cloud-500/80 text-sm cursor-pointer font-medium hover:text-cloud-500">
                                    Esqueci a minha senha
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !emailValido}
                            >
                                {isLoading ? 'Entrando...' : 'Entrar na minha conta'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Mobile: abaixo do form | md+: canto superior direito */}
                <div className="mt-4 flex items-center gap-4 rounded-3xl border-2 border-neutral-300 bg-white p-2 pl-4 md:absolute md:right-4 md:top-4 md:mt-0">
                    <p className="text-cloud-500 font-medium">Não tem uma conta?</p>
                    <button
                        onClick={() => navigate('/auth/register')}
                        className="cursor-pointer rounded-2xl bg-lime-500 px-5 py-3 font-bold text-cloud-100 transition-all duration-300 hover:bg-lime-500/90"
                    >
                        Crie uma
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
