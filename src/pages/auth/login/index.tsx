import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Label from '../../../components/ui/Label'
import Button from '../../../components/ui/Button'
import { CirclePasswordIcon, MailOpenLoveIcon } from '@hugeicons/core-free-icons'

const LoginPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            // TODO: Chamar API de login
            console.log('Login:', { email, password })
            // navigate('/') // Navegar para home após login bem-sucedido
        } catch (error) {
            console.error('Erro ao fazer login:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 p-4">
            <div className="w-full max-w-xl bg-white rounded-3xl p-8  border-2 border-neutral-300 ">
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-cloud-500 font-baskerville">
                            Olá, <span className="text-campfire-500 font-baskerville">Bem vindo!</span>
                        </p>
                        <p className="text-lg text-neutral-500 mt-2 font-baskerville">
                            Entre na sua conta para continuar
                        </p>
                    </div>

                    <div className=" space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">E-mail:</Label>
                            <Input
                                id="email"
                                icon={MailOpenLoveIcon}
                                placeholder="usuario@example.com"
                                value={email}
                                onChange={(value) => setEmail(value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Sua Senha:</Label>
                            <Input
                                id="password"
                                type="password"
                                icon={CirclePasswordIcon}
                                placeholder="Sua melhor senha"
                                value={password}
                                onChange={(value) => setPassword(value)}
                            />
                            <p className="text-end text-cloud-500/80 text-sm cursor-pointer font-medium hover:text-cloud-500">
                                Esqueci a minha senha
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar na minha conta'}
                        </Button>

                        <div className="flex items-center justify-center gap-2">
                            <p className="text-cloud-500 font-medium">Não tem uma conta?</p>
                            <button
                                onClick={() => navigate('/auth/register')}
                                className="p-3 bg-cloud-100 text-cloud-500 rounded-2xl transition-all duration-300 font-bold cursor-pointer hover:bg-cloud-300/50"
                            >
                                Crie uma
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default LoginPage
