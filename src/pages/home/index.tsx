import { useState } from "react"
import Button from "../../components/ui/Button"
import Modal from "../../components/ui/Modal"
import Login from "../../components/feature/auth/login"
import Register from "../../components/feature/auth/register"


function Home() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [account, setAccount] = useState<boolean>(true)
    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Click me</Button>

            <Modal open={isModalOpen} onClose={(value) => setIsModalOpen(value)}>
                {account ? (
                    <div className="space-y-4">
                        <Login />
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-cloud-500 font-medium">Já tem uma conta no sistema ?</p>
                            <button className="p-4 bg-cloud-100 text-cloud-500 rounded-2xl transition-all duration-300 font-bold cursor-pointer hover:bg-cloud-300/50"
                                onClick={() => setAccount(false)}>
                                Entre
                            </button>
                        </div>
                    </div>
                ) : (
                     <div className="space-y-4">
                         <Register />
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-cloud-500 font-medium">Não tem uma conta?</p>
                            <button className="p-4 bg-cloud-100 text-cloud-500 rounded-2xl transition-all duration-300 font-bold cursor-pointer hover:bg-cloud-300/50"
                                onClick={() => setAccount(true)}>
                                Crie uma
                            </button>
                        </div>
                    </div>
                
                )}
            </Modal>
        </>
    )
}

export default Home



