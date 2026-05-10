import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-linear-to-br from-cloud-50 to-cloud-100">
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
        </div>
    )
}

export default Home
