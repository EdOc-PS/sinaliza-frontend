import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/config/context/AuthContext'
import { toast } from 'sonner'
import AuthBackground from '@/components/layout/AuthBackground'
import Input from '@components/ui/Input'
import Label from '@components/ui/Label'
import Button from '@components/ui/Button'
import Select from '@components/ui/Select'
import InputText from '@components/ui/InputText'
import ProgressBar from '@/components/layout/ProgressBar'
import {
    CirclePasswordIcon,
    LocationUser01Icon,
    MailOpenLoveIcon,
    PenTool03Icon,
    SmartPhone01Icon,
} from '@hugeicons/core-free-icons'
import BackButton from '@components/ui/BackButton'
import { maskPhone } from '@lib/mask/mask'
import { PERFIL_FORMULARIOS as perfilFormularios, type PerfilId } from '@lib/constants/profileFields'
import type { Role } from '@api/requests'

// Register cria apenas contas de STUDENT e GUARDIAN.
// Educadores (professor/intérprete) são cadastrados pelo MANAGER via EducatorForm.
const perfilRoleMap: Partial<Record<PerfilId, Role>> = {
    student: 'STUDENT',
    guardian: 'GUARDIAN',
}

type UserProps = {
    nome: string
    email: string
    phone: string
    bio: string
    senha: string
    confirmarSenha: string
    perfil: PerfilId | null
    dadosPerfil: Record<string, string>
}

type ProfileArrayProps = {
    id: PerfilId
    titulo: string
    descricao: string
    classes: string
}

const RegisterPage = () => {
    const navigate = useNavigate()
    const { register: registerAuth, user: authUser } = useAuth()

    const [loading, setIsLoading] = useState(false)
    const [view, setView] = useState<number>(0)
    const [user, setUser] = useState<UserProps>({
        nome: '',
        email: '',
        phone: '',
        bio: '',
        senha: '',
        confirmarSenha: '',
        perfil: null,
        dadosPerfil: {},
    })

    const perfis: Array<ProfileArrayProps> = [
        {
            id: 'student',
            titulo: 'Estudante',
            descricao: 'Aprendizado continuo e diario de estudos',
            classes: 'bg-sky-100 text-sky-800',
        },
        {
            id: 'guardian',
            titulo: 'Familiar',
            descricao: 'Apoio domestico e conexao familiar',
            classes: 'bg-lime-100 text-lime-800',
        },
    ]

    const formularioSelecionado = user.perfil ? perfilFormularios[user.perfil] : null

    const handleUserChange = (field: keyof UserProps, value: string | PerfilId | null) => {
        setUser((prev) => ({ ...prev, [field]: value }))
    }

    const handleDataProfileChange = (fieldId: string, value: string) => {
        setUser((prev) => ({
            ...prev,
            dadosPerfil: { ...prev.dadosPerfil, [fieldId]: value },
        }))
    }

    // View 0: Dados pessoais (nome e email obrigatórios; nome mínimo 3 chars)
    const nomeValido = user.nome.trim().length >= 3
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())
    const isView0Valid = nomeValido && emailValido

    // View 2: Dados do perfil (todos os campos obrigatórios)
    const isView2Valid = () => {
        if (!formularioSelecionado) return false
        return formularioSelecionado.campos.every(
            (campo) => user.dadosPerfil[campo.id]?.trim() !== ''
        )
    }

    // View 4: Senha (ambas obrigatórias, mínimo 6 chars e devem coincidir)
    const senhaValida = user.senha.length >= 6
    const senhasIguais = user.senha === user.confirmarSenha
    const senhasValidas = user.senha.trim() !== '' && user.confirmarSenha.trim() !== ''
    const isView4Valid = senhasValidas && senhasIguais && senhaValida

    // Avança/submete o step atual ao pressionar Enter ou clicar no botão principal
    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (view === 0 && isView0Valid) { setView(1); return; }
        if (view === 1 && user.perfil) { setView(2); return; }
        if (view === 2 && isView2Valid()) { setView(3); return; }
        if (view === 3) { setView(4); return; }
        if (view === 4 && isView4Valid) { handleRegister(); }
    };

    // Função de registro
    const handleRegister = async () => {
        if (!user.perfil) return
        const role = perfilRoleMap[user.perfil]
        if (!role) return
        setIsLoading(true)
        try {
            const payload = {
                name: user.nome,
                email: user.email,
                password: user.senha,
                role,
                phone: user.phone || undefined,
                bio: user.bio || undefined,
                dataProfile: {
                    ...user.dadosPerfil,
                },
            }
            await registerAuth(payload)
            console.log('Usuário registrado:', authUser)
            toast.success('Conta criada com sucesso!')
            setView(5)
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar conta')
            console.error('Erro ao criar conta:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-start px-4 py-6 sm:py-8 relative">
            <AuthBackground />

            <div className='flex flex-col items-center gap-3 sm:gap-4 w-full'>
                {/* Logo */}
                <div className='flex items-center'>
                    <img src="/src/assets/images/logo/logo-simples.png" alt="Logo do Sinaliza" className='w-20 h-20 sm:w-20 sm:h-20' />
                    <h1 className='text-2xl sm:text-3xl font-bold text-cloud-500'>sinaliza</h1>
                </div>

                {/* Formulário de Registro */}
                <form onSubmit={handleStepSubmit} className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-neutral-300">
                    <div className="space-y-6">
                        <ProgressBar currentStep={view} totalSteps={6} style={{ marginBottom: "2rem", justifyContent: "center" }} />

                        {/* Step 0: Dados pessoais */}
                        {view === 0 && (
                            <>
                                <div className='flex w-full justify-center'>
                                    <img src="/src/assets/images/hello.png" alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        Dados pessoais
                                    </p>
                                    <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                        Vamos começar com o básico
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="nome">Seu nome:</Label>
                                        <Input
                                            id="nome"
                                            icon={LocationUser01Icon}
                                            placeholder="Digite seu nome"
                                            value={user.nome}
                                            noSpecialChars
                                            onChange={(value) => handleUserChange('nome', value)}
                                        />
                                        {user.nome.trim() !== '' && !nomeValido && (
                                            <p className="text-xs text-neutral-400 pl-1">
                                                O nome precisa ter pelo menos 3 caracteres.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">E-mail:</Label>
                                        <Input
                                            id="email"
                                            icon={MailOpenLoveIcon}
                                            placeholder="usuario@example.com"
                                            value={user.email}
                                            onChange={(value) => handleUserChange('email', value)}
                                        />
                                        {user.email.trim() !== '' && !emailValido && (
                                            <p className="text-xs text-neutral-400 pl-1">
                                                Digite um e-mail válido.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="phone" isOptional>
                                            Telefone:
                                        </Label>
                                        <Input
                                            id="phone"
                                            icon={SmartPhone01Icon}
                                            placeholder="(31) 99999-9999"
                                            value={user.phone}
                                            onChange={(value) => handleUserChange('phone', maskPhone(value))}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!isView0Valid}
                                >
                                    Próximo
                                </Button>
                            </>
                        )}

                        {/* Step 1: Perfil */}
                        {view === 1 && (
                            <>
                                <div className='flex w-full justify-center'>
                                    <img src="/src/assets/images/profile.png" alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        Perfil de uso
                                    </p>
                                    <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                        Selecione o perfil que melhor se encaixa
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {perfis.map((perfil) => {
                                        const selecionado = user.perfil === perfil.id

                                        return (
                                            <button
                                                key={perfil.id}
                                                type="button"
                                                onClick={() => handleUserChange('perfil', perfil.id)}
                                                className={`flex items-start cursor-pointer rounded-3xl px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 border-2 ${perfil.classes} ${selecionado ? "border-current/50" : "border-transparent opacity-90"
                                                    }`}
                                            >
                                                <div>
                                                    <p className="text-lg font-bold">{perfil.titulo}</p>
                                                    <p className="break-normal mt-1 text-sm font-medium opacity-90">{perfil.descricao}</p>
                                                </div>

                                                <img src={`/src/assets/images/${perfil.id}.png`} alt="" className='w-12 h-12 sm:w-15 sm:h-15 mt-4 sm:mt-8' />


                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <BackButton onClick={() => setView(0)} />
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={!user.perfil}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Dados do perfil */}
                        {view === 2 && (
                            <>
                                <div className='flex w-full justify-center'>
                                    <img src={`/src/assets/images/${user.perfil}.png`} alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        {formularioSelecionado?.titulo}
                                    </p>
                                    <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                        {formularioSelecionado?.descricao}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {formularioSelecionado?.campos.map((campo) => (
                                        <div key={campo.id} className="flex flex-col gap-2">
                                            <Label htmlFor={campo.id}>{campo.label}</Label>
                                            {campo.kind === 'select' ? (
                                                <Select
                                                    id={campo.id}
                                                    icon={campo.icon}
                                                    value={user.dadosPerfil[campo.id] || ''}
                                                    onChange={(value) =>
                                                        handleDataProfileChange(campo.id, value)
                                                    }
                                                    options={campo.options || []}
                                                />
                                            ) : (
                                                <Input
                                                    id={campo.id}
                                                    icon={campo.icon}
                                                    type={campo.type}
                                                    placeholder={campo.placeholder}
                                                    value={user.dadosPerfil[campo.id] || ''}
                                                    noSpecialChars={campo.noSpecialChars}
                                                    onChange={(value) =>
                                                        handleDataProfileChange(campo.id, value)
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <BackButton onClick={() => setView(1)} />
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={!isView2Valid()}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Bio */}
                        {view === 3 && (
                            <>
                                <div className='flex w-ful justify-center '>
                                    <img src="/src/assets/images/pen.png" alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        Sua Bio
                                    </p>
                                    <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                        Conte um pouco sobre você
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="bio" isOptional>Biografia:</Label>
                                    <InputText
                                        id="bio"
                                        icon={PenTool03Icon}
                                        placeholder="Escreva uma breve descrição sobre você, seus interesses e o que espera encontrar na plataforma."
                                        value={user.bio}
                                        onChange={(value) => handleUserChange('bio', value)}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <BackButton onClick={() => setView(2)} />
                                    <Button type="submit" className="flex-1">
                                        Próximo
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Senha */}
                        {view === 4 && (
                            <>
                                <div className='flex w-ful justify-center '>
                                    <img src="/src/assets/images/security.png" alt="" className='w-16 h-16 sm:w-20 sm:h-20' />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-cloud-500 font-baskerville">
                                        Criar Senha
                                    </p>
                                    <p className="text-sm sm:text-lg text-neutral-500 mt-2 font-baskerville">
                                        Crie uma senha segura para sua conta
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="senha">Senha:</Label>
                                        <Input
                                            id="senha"
                                            icon={CirclePasswordIcon}
                                            type="password"
                                            placeholder="Escreva sua melhor senha"
                                            value={user.senha}
                                            onChange={(value) => handleUserChange('senha', value)}
                                        />
                                        {user.senha.trim() !== '' && !senhaValida && (
                                            <p className="text-xs text-neutral-400 pl-1">
                                                A senha precisa ter pelo menos 6 caracteres.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="confirmarSenha">Confirmar Senha:</Label>
                                        <Input
                                            id="confirmarSenha"
                                            icon={CirclePasswordIcon}
                                            type="password"
                                            placeholder="Repita a senha"
                                            value={user.confirmarSenha}
                                            onChange={(value) => handleUserChange('confirmarSenha', value)}
                                        />
                                    </div>

                                    {senhasValidas && !senhasIguais && (
                                        <p className="text-xs text-neutral-400 pl-1">
                                            As senhas não coincidem.
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <BackButton onClick={() => setView(3)} />
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={!isView4Valid || loading}
                                    >
                                        {loading ? 'Criando conta...' : 'Criar Conta'}
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 5: Sucesso */}
                        {view === 5 && (
                            <>
                                <div className="space-y-8 text-center flex flex-col items-center">
                                    <p className="text-2xl sm:text-3xl text-cloud-500 font-baskerville">
                                        Bem-vindo ao Sinaliza
                                    </p>


                                    <div className="flex justify-center p-6 sm:p-8 rounded-full bg-green-400/50">
                                        <img src="/src/assets/images/approve.png" alt="" className='w-20 h-20 sm:w-25 sm:h-25' />
                                    </div>
                                    <p className='text-neutral-500 font-medium text-sm sm:text-base'>
                                        Sua conta foi criada com sucesso. Agora você faz parte de uma comunidade comprometida com a inclusão
                                    </p>
                                </div>


                                <Button
                                    className="w-full"
                                    onClick={() => navigate('/auth/login')}
                                >
                                    Ir para Login
                                </Button>
                            </>
                        )}
                    </div>
                </form>

                {/* Mobile: abaixo do form | md+: canto superior direito */}
                <div className="mt-1 flex items-center gap-4 rounded-3xl border-2 border-neutral-300 bg-white p-2 pl-4 md:absolute md:right-4 md:top-4 md:mt-0">
                    <p className="text-cloud-500 font-medium">Já tem uma conta?</p>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="cursor-pointer rounded-2xl bg-campfire-500 px-5 py-3 font-bold text-cloud-100 transition-all duration-300 hover:bg-campfire-500/90"
                    >
                        Faça login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
