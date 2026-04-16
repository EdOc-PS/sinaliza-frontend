import { useState } from "react"
import Input from "../../../ui/Input"
import Label from "../../../ui/Label"
import Button from "../../../ui/Button"

import { CirclePasswordIcon, MailOpenLoveIcon } from "@hugeicons/core-free-icons"

const Login = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-4xl font-bold text-cloud-500 font-baskerville">Olá, <span className="text-campfire-500 font-baskerville">Bem vindo!</span></p>
                <p className="text-lg text-neutral-500 mt-2 font-baskerville">Organizado em grid para melhor leitura.</p>
            </div>

            <div className="grid gap-4 md:col-span-1">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">
                        E-mail:
                    </Label>
                    <Input
                        id="email"
                        icon={MailOpenLoveIcon}
                        placeholder="usuario@example.com"
                        value={email}
                        onChange={(value) => setEmail(value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="nome">
                        Sua Senha:
                    </Label>
                    <Input
                        id="nome"
                        type="password"
                        icon={CirclePasswordIcon}
                        placeholder="Sua melhor senha"
                        value={nome}
                        onChange={(value) => setNome(value)}
                    />
                    <p className="text-end text-cloud-500/80">Esqueci a minha senha</p>
                </div>
            </div>

            <Button className="w-full" onClick={() => console.log("ts")}>
                Entrar na minha conta
            </Button>
        </div>
    )
}

export default Login
