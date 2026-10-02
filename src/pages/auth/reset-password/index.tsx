import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { CirclePasswordIcon } from '@hugeicons/core-free-icons'

import AuthBackground from '@/components/layout/AuthBackground'
import Input from '@components/ui/Input'
import Label from '@components/ui/Label'
import Button from '@components/ui/Button'
import { PostRequest } from '@requests'
import { AUTH } from '@routes/auth'
import logoImg from '@/assets/images/logo/logo-simples.png'
import securityImg from '@/assets/images/security.png'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const token = params.get('token') ?? ''

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)

    const longEnough = password.length >= 6
    const matches = password === confirm
    const isValid = !!token && longEnough && matches

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid) return
        setLoading(true)
        try {
            const response = await PostRequest(AUTH.RESET_PASSWORD(), { token, password })
            if (!response.success) {
                toast.error(response.message || 'Não foi possível redefinir a senha')
                return
            }
            toast.success('Senha redefinida! Entre com a nova senha.')
            navigate('/auth/login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
            <AuthBackground />
            <div className="flex flex-col items-center w-full">
                <div className="flex items-center">
                    <img src={logoImg} alt="Logo do Sinaliza" className="w-20 h-20" />
                    <h1 className="font-baskerville text-2xl sm:text-3xl font-bold text-cloud-500">Sinaliza</h1>
                </div>

                <div className="w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 border-2 border-neutral-300">
                    <div className="space-y-6">
                        <div className="flex w-full justify-center">
                            <img src={securityImg} alt="" className="w-16 h-16 sm:w-20 sm:h-20" />
                        </div>

                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                Crie uma <span className="text-campfire-500">nova senha</span>
                            </p>
                            <p className="text-sm sm:text-base text-neutral-500 mt-2 font-baskerville">
                                Escolha uma senha com pelo menos 6 caracteres.
                            </p>
                        </div>

                        {!token ? (
                            <div className="flex flex-col gap-4 text-center">
                                <p className="rounded-2xl bg-salmon-100 px-4 py-3 text-sm text-salmon-700">
                                    Link inválido. Abra o link exatamente como chegou no email ou peça um novo.
                                </p>
                                <Button type="button" className="w-full" onClick={() => navigate('/auth/forgot-password')}>
                                    Pedir novo link
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">Nova senha:</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        icon={CirclePasswordIcon}
                                        placeholder="Sua nova senha"
                                        value={password}
                                        onChange={setPassword}
                                        autoFocus
                                    />
                                    {password !== '' && !longEnough && (
                                        <p className="text-xs text-neutral-400 pl-1">A senha precisa ter pelo menos 6 caracteres.</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirm">Confirme a senha:</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        icon={CirclePasswordIcon}
                                        placeholder="Repita a nova senha"
                                        value={confirm}
                                        onChange={setConfirm}
                                    />
                                    {confirm !== '' && !matches && (
                                        <p className="text-xs text-neutral-400 pl-1">As senhas não coincidem.</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!isValid || loading}
                                    loading={loading}
                                    loadingText="Salvando"
                                >
                                    Salvar nova senha
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage
