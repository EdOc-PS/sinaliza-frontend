import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cloud-50 to-cloud-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-cloud-500 font-baskerville">
                            Sinaliza
                        </h1>
                        <div className="flex gap-3">
                            <Button
                                className="text-sm"
                                onClick={() => navigate('/auth/login')}
                            >
                                Entrar
                            </Button>
                            <Button
                                className="text-sm bg-campfire-500 hover:bg-campfire-600"
                                onClick={() => navigate('/auth/register')}
                            >
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-6xl font-bold text-cloud-500 font-baskerville">
                            Repositório de <span className="text-campfire-500">Sinais</span>
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Uma plataforma inclusiva para pessoas surdas cadastrarem, compartilharem e
                            consultarem sinais de forma centralizada.
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center pt-8">
                        <Button
                            className="text-lg px-8 py-3"
                            onClick={() => navigate('/auth/register')}
                        >
                            Começar Agora
                        </Button>
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="px-8 py-3 border-2 border-cloud-500 text-cloud-500 rounded-2xl font-bold hover:bg-cloud-50 transition"
                        >
                            Já tenho conta
                        </button>
                    </div>
                </div>

                {/* Features (futura) */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-cloud-500 mb-2">Cadastro Fácil</h3>
                        <p className="text-neutral-600">
                            Registre seus sinais em poucos passos com nossa interface intuitiva.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-cloud-500 mb-2">Comunidade Ativa</h3>
                        <p className="text-neutral-600">
                            Conecte-se com educadores, intérpretes e outros usuários surdos.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-cloud-500 mb-2">Acessibilidade</h3>
                        <p className="text-neutral-600">
                            Plataforma desenvolvida com foco em acessibilidade e inclusão.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
