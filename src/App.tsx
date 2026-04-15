import { useState } from "react"
import Modal from "./components/ui/Modal"
import Button from "./components/ui/Button"
import Input from "./components/ui/Input"
import Label from "./components/ui/Label"
import { LocationUser01Icon, MailOpenLoveIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons"


function App() {
  const [view, setView] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState<string>("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");

  const perfis = [
    {
      id: "estudante",
      titulo: "Estudante",
      descricao: "Aprendizado continuo e diario de estudos",
      classes: "bg-sky-100 border-sky-300 text-sky-900",
    },
    {
      id: "professor",
      titulo: "Professor",
      descricao: "Gestao de turmas e compartilhamento",
      classes: "bg-[#ffd6c9] border-[#f8a892] text-[#8a3a24]",
    },
    {
      id: "instrutor",
      titulo: "Instrutor",
      descricao: "Praticas guiadas e acompanhamento",
      classes: "bg-yellow-100 border-yellow-300 text-yellow-900",
    },
    {
      id: "familiar",
      titulo: "Familiar",
      descricao: "Apoio domestico e conexao familiar",
      classes: "bg-lime-100 border-lime-300 text-lime-900",
    },
  ]





  return (
    <>
      <p>hello word</p>
      <Button onClick={() => setIsModalOpen(true)}>Click me</Button>

      <Modal open={isModalOpen} onClose={(value) => setIsModalOpen(value)}>
        <div className="space-y-6">

          <div className="flex gap-2 mb-4">
            <div className={`flex-1 h-1.5 rounded-full transition-colors ${view >= 0 ? "bg-lime-500" : "bg-neutral-200"}`}></div>
            <div className={`flex-1 h-1.5 rounded-full transition-colors ${view >= 1 ? "bg-lime-500" : "bg-neutral-200"}`}></div>
          </div>

          {view === 0 && (
            <>
              <div className="text-center">
                <p className="text-4xl font-bold text-cloud-500 font-baskerville">Dados pessoais</p>
                <p className="text-lg text-neutral-500 mt-2 font-baskerville">Organizado em grid para melhor leitura.</p>
              </div>

              <div className="grid gap-4 md:col-span-1">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nome">
                    Seu nome:
                  </Label>
                  <Input
                    id="nome"
                    icon={LocationUser01Icon}
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(value) => setNome(value)}
                  />
                </div>

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

                <div className="flex flex-col gap-2 ">
                  <Label htmlFor="numero">
                    Número:
                  </Label>
                  <Input
                    id="numero"
                    icon={SmartPhone01Icon}
                    placeholder="55+ 99999-9999"
                    value={numero}
                    onChange={(value) => setNumero(value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={() => setView(1)}>
                Proximo
              </Button>
            </>
          )}

          {view === 1 && (
            <>
              <div className="text-center">
                <p className="text-4xl font-bold text-cloud-500 font-baskerville">Perfil de uso</p>
                <p className="text-lg text-neutral-500 mt-2 font-baskerville">Selecione o perfil que melhor se encaixa com seu uso.</p>
              </div>



              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-1">
                {perfis.map((perfil) => {
                  const selecionado = perfilSelecionado === perfil.id

                  return (
                    <button
                      key={perfil.id}
                      type="button"
                      onClick={() => setPerfilSelecionado(perfil.id)}
                      className={`rounded-3xl px-5 py-6 text-left transition-all duration-200 hover:-translate-y-0.5 ${perfil.classes} ${selecionado ? "ring-2 ring-cloud-500 shadow-md" : "opacity-90"
                        }`}
                    >
                      <p className="text-2xl font-bold">{perfil.titulo}</p>
                      <p className="mt-1 text-md font-medium opacity-80">{perfil.descricao}</p>
                    </button>
                  )
                })}
              </div>

              <div>
                <Button className="w-full" onClick={() => setView(0)}>
                  Proximo
                </Button>
              </div>

            </>
          )}
        </div>

      </Modal>
    </>
  )
}

export default App
