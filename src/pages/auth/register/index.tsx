import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/Input'
import Label from '../../../components/ui/Label'
import Button from '../../../components/ui/Button'
import Select from '../../../components/ui/Select'
import InputText from '../../../components/ui/InputText'
import {
    ArrowLeft01Icon,
    Backpack01Icon,
    CheckmarkBadge01Icon,
    CirclePasswordIcon,
    ConversationIcon,
    DiplomaIcon,
    HealtcareIcon,
    HierarchyCircle02Icon,
    LocationUser01Icon,
    Mail01Icon,
    MailOpenLoveIcon,
    PenTool03Icon,
    SchoolIcon,
    SmartPhone01Icon,
    StationeryIcon,
    TeacherIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

type PerfilId = 'student' | 'educator' | 'interpreter' | 'guardian'

type CampoFormulario = {
    id: string
    label: string
    placeholder?: string
    icon?: typeof LocationUser01Icon
    type?: string
    kind?: 'input' | 'select'
    options?: Array<{ label: string; value: string }>
}

const perfilFormularios: Record<
    PerfilId,
    { titulo: string; descricao: string; campos: CampoFormulario[] }
> = {
    student: {
        titulo: 'Dados do estudante',
        descricao: 'Complete as informações acadêmicas e de apoio.',
        campos: [
            {
                id: 'institute',
                label: 'Instituto:',
                placeholder: 'Nome da instituição',
                icon: SchoolIcon,
            },
            {
                id: 'grauEscolar',
                label: 'Grau escolar:',
                placeholder: 'Ex: 8º ano, ensino médio, graduação',
                icon: Backpack01Icon,
            },
            {
                id: 'necessidadesEspeciais',
                label: 'Necessidades especiais:',
                placeholder: 'Descreva se houver alguma',
                icon: HealtcareIcon,
            },
        ],
    },
    educator: {
        titulo: 'Dados do educador',
        descricao: 'Informe a atuação acadêmica principal.',
        campos: [
            {
                id: 'institute',
                label: 'Instituto:',
                placeholder: 'Nome da instituição',
                icon: SchoolIcon,
            },
            {
                id: 'department',
                label: 'Departamento:',
                placeholder: 'Ex: Matemática, Pedagogia',
                icon: TeacherIcon,
            },
            {
                id: 'specialty',
                label: 'Especialidade:',
                placeholder: 'Área de maior atuação',
                icon: StationeryIcon,
            },
        ],
    },
    interpreter: {
        titulo: 'Dados do intérprete',
        descricao: 'Detalhe a formação e a área de apoio.',
        campos: [
            {
                id: 'institute',
                label: 'Instituto:',
                placeholder: 'Nome da instituição',
                icon: SchoolIcon,
            },
            {
                id: 'proficienciaLibras',
                label: 'Proficiência em Libras:',
                icon: ConversationIcon,
                kind: 'select',
                options: [
                    { label: 'Básico', value: 'BASICO' },
                    { label: 'Intermediário', value: 'INTERMEDIARIO' },
                    { label: 'Avançado', value: 'AVANCADO' },
                    { label: 'Fluente', value: 'FLUENTE' },
                ],
            },
            {
                id: 'certificate',
                label: 'Certificado:',
                placeholder: 'Informação sobre certificação',
                icon: DiplomaIcon,
            },
            {
                id: 'areaAtuacao',
                label: 'Área de atuação:',
                placeholder: 'Ex: reforço escolar, interpretação',
                icon: TeacherIcon,
            },
        ],
    },
    guardian: {
        titulo: 'Dados do responsável',
        descricao: 'Preencha as informações de vínculo.',
        campos: [
            {
                id: 'studentEmail',
                label: 'Email do aluno:',
                placeholder: 'aluno@email.com',
                icon: Mail01Icon,
            },
            {
                id: 'parentesco',
                label: 'Parentesco:',
                placeholder: 'Ex: mãe, pai, avó',
                icon: HierarchyCircle02Icon,
            },
        ],
    },
}

const RegisterPage = () => {
    const navigate = useNavigate()
    const [view, setView] = useState<number>(0)
    const [perfilSelecionado, setPerfilSelecionado] = useState<PerfilId | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Dados base
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    // Dados de perfil (dinâmicos)
    const [dataProfile, setDataProfile] = useState<Record<string, string>>({})

    const perfis: Array<{ id: PerfilId; titulo: string; descricao: string; classes: string }> = [
        {
            id: 'student',
            titulo: 'Estudante',
            descricao: 'Aprendizado continuo e diario de estudos',
            classes: 'bg-sky-100 border-sky-300 text-sky-900',
        },
        {
            id: 'educator',
            titulo: 'Professor',
            descricao: 'Gestao de turmas e compartilhamento',
            classes: 'bg-[#ffd6c9] border-[#f8a892] text-[#8a3a24]',
        },
        {
            id: 'interpreter',
            titulo: 'Interprete',
            descricao: 'Praticas guiadas e acompanhamento',
            classes: 'bg-yellow-100 border-yellow-300 text-yellow-900',
        },
        {
            id: 'guardian',
            titulo: 'Familiar',
            descricao: 'Apoio domestico e conexao familiar',
            classes: 'bg-lime-100 border-lime-300 text-lime-900',
        },
    ]

    const formularioSelecionado = perfilSelecionado ? perfilFormularios[perfilSelecionado] : null

    const handleDataProfileChange = (fieldId: string, value: string) => {
        setDataProfile((prev) => ({ ...prev, [fieldId]: value }))
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 p-4">
            <div className="w-full max-w-xl bg-white rounded-3xl p-8  border-2 border-neutral-300 ">
                <div className="space-y-10">
                    {/* Progress bar */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[0, 1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`h-2 rounded-full transition-all ${view >= step ? 'bg-green-500 w-8' : 'bg-neutral-200 w-6'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step 0: Dados pessoais */}
                    {view === 0 && (
                        <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                    Dados pessoais
                                </p>
                                <p className="text-lg text-neutral-500 mt-2 font-baskerville">
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
                                        value={nome}
                                        onChange={(value) => setNome(value)}
                                    />
                                </div>

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
                                    <Label htmlFor="phone">Telefone:</Label>
                                    <Input
                                        id="phone"
                                        icon={SmartPhone01Icon}
                                        placeholder="(31) 99999-9999"
                                        value={phone}
                                        onChange={(value) => setPhone(value)}
                                    />
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => setView(1)}>
                                Próximo
                            </Button>
                        </>
                    )}

                    {/* Step 1: Perfil */}
                    {view === 1 && (
                        <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                    Perfil de uso
                                </p>
                                <p className="text-lg text-neutral-500 mt-2 font-baskerville">
                                    Selecione o perfil que melhor se encaixa
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {perfis.map((perfil) => {
                                    const selecionado = perfilSelecionado === perfil.id

                                    return (
                                        <button
                                            key={perfil.id}
                                            type="button"
                                            onClick={() => setPerfilSelecionado(perfil.id)}
                                            className={`cursor-pointer rounded-3xl px-5 py-6 text-left transition-all duration-200 hover:-translate-y-0.5 ${perfil.classes} ${selecionado ? "ring-2 ring-cloud-500 shadow-md" : "opacity-90"
                                                }`}
                                        >
                                            <p className="text-lg font-bold">{perfil.titulo}</p>
                                            <p className="mt-1 text-sm font-medium opacity-80">{perfil.descricao}</p>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setView(0)}
                                    className="w-16 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} size={26} />
                                </button>
                                <Button
                                    className="flex-1"
                                    onClick={() => setView(2)}
                                    disabled={!perfilSelecionado}
                                >
                                    Próximo
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Dados do perfil */}
                    {view === 2 && (
                        <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                    {formularioSelecionado?.titulo}
                                </p>
                                <p className="text-lg text-neutral-500 mt-2 font-baskerville">
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
                                                value={dataProfile[campo.id] || ''}
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
                                                value={dataProfile[campo.id] || ''}
                                                onChange={(value) =>
                                                    handleDataProfileChange(campo.id, value)
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setView(1)}
                                    className="w-16 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} size={28} />
                                </button>
                                <Button className="flex-1" onClick={() => setView(3)}>
                                    Próximo
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Bio */}
                    {view === 3 && (
                        <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                    Sua Bio
                                </p>
                                <p className="text-lg text-neutral-500 mt-2 font-baskerville">
                                    Conte um pouco sobre você
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="bio">Biografia:</Label>
                                <InputText
                                    id="bio"
                                    icon={PenTool03Icon}
                                    placeholder="Escreva uma breve descrição sobre você, seus interesses e o que espera encontrar na plataforma."
                                    value={bio}
                                    onChange={(value) => setBio(value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setView(2)}
                                    className="w-16 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} size={28} />
                                </button>
                                <Button className="flex-1" onClick={() => setView(4)}>
                                    Próximo
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 4: Senha */}
                    {view === 4 && (
                        <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                    Criar Senha
                                </p>
                                <p className="text-lg text-neutral-500 mt-2 font-baskerville">
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
                                        placeholder="Mínimo 6 caracteres"
                                        value={senha}
                                        onChange={(value) => setSenha(value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmarSenha">Confirmar Senha:</Label>
                                    <Input
                                        id="confirmarSenha"
                                        icon={CirclePasswordIcon}
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={confirmarSenha}
                                        onChange={(value) => setConfirmarSenha(value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setView(3)}
                                    className="w-16 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} size={28} />
                                </button>
                                <Button
                                    className="flex-1"
                                    onClick={() => { }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 5: Sucesso */}
                    {view === 5 && (
                        <>
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <HugeiconsIcon
                                            icon={CheckmarkBadge01Icon}
                                            size={40}
                                            className="text-green-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold text-cloud-500 font-baskerville">
                                        Conta Criada com Sucesso!
                                    </p>
                                    <p className="text-lg text-neutral-500 font-baskerville">
                                        Bem-vindo à plataforma Sinaliza
                                    </p>
                                </div>
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
            </div>
        </div>
    )
}

export default RegisterPage
