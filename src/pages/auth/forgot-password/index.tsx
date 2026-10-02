import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { HandPointingLeft02Icon, MailOpenLoveIcon } from '@hugeicons/core-free-icons'

import AuthBackground from '@/components/layout/AuthBackground'
import Input from '@components/ui/Input'
import Label from '@components/ui/Label'
import Button from '@components/ui/Button'
import { PostRequest } from '@requests'
import { AUTH } from '@routes/auth'
import { isValidEmail } from '@lib/validation/email'
import logoImg from '@/assets/images/logo/logo-simples.png'
import securityImg from '@/assets/images/security.png'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const emailValido = isValidEmail(email.trim())

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!emailValido) return
        setLoading(true)
        try {
            const response = await PostRequest(AUTH.FORGOT_PASSWORD(), { email: email.trim() })
            if (!response.success) {
                toast.error(response.message || 'Não foi possível enviar o email')
                return
            }
            setSent(true)
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

                        {sent ? (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                    Confira seu <span className="text-campfire-500">email</span>
                                </p>
                                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                                    Se <b className="text-cloud-500">{email.trim()}</b> estiver cadastrado, você vai receber
                                    um link para criar uma nova senha. O link vale por 1 hora.
                                </p>
                                <p className="rounded-2xl bg-sunflower-100 px-4 py-3 text-xs text-sunflower-700">
                                    Não chegou em alguns minutos? Confira a caixa de spam.
                                </p>
                                <Button type="button" className="w-full" onClick={() => navigate('/auth/login')}>
                                    Voltar para o login
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        Esqueceu a <span className="text-campfire-500">senha?</span>
                                    </p>
                                    <p className="text-sm sm:text-base text-neutral-500 mt-2 font-baskerville">
                                        Informe seu email e enviaremos um link para criar uma nova.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">E-mail:</Label>
                                        <Input
                                            id="email"
                                            icon={MailOpenLoveIcon}
                                            placeholder="usuario@exemplo.com"
                                            value={email}
                                            onChange={setEmail}
                                            autoFocus
                                        />
                                        {email.trim() !== '' && !emailValido && (
                                            <p className="text-xs text-neutral-400 pl-1">Digite um e-mail válido.</p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/auth/login')}
                                            aria-label="Voltar para o login"
                                            className="flex shrink-0 cursor-pointer items-center justify-center rounded-2xl lg:rounded-3xl bg-cloud-300/80 w-12 lg:w-16 transition-colors hover:bg-cloud-400/60"
                                        >
                                            <HugeiconsIcon icon={HandPointingLeft02Icon} size={24} />
                                        </button>
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={!emailValido || loading}
                                            loading={loading}
                                            loadingText="Enviando"
                                        >
                                            Enviar link
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
