import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, Alert02Icon } from "@hugeicons/core-free-icons";

import AuthBackground from "@components/layout/AuthBackground";
import Button from "@components/ui/Button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
            <AuthBackground />

            <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border-2 border-neutral-200 bg-white p-8 text-center sm:p-10">
                <img src="/src/assets/images/404.webp" alt="" className="h-40 w-40 object-contain sm:h-48 sm:w-48" />

                <div className="flex flex-col gap-2">
                    <h1 className="font-baskerville text-2xl font-bold text-cloud-600 sm:text-3xl">
                        Página não <span className="italic text-campfire-500 font-baskerville">encontrada</span>
                    </h1>
                    <p className="text-sm leading-relaxed text-cloud-500 sm:text-base">
                        O endereço que você tentou acessar não existe ou foi movido.
                        Verifique o link ou volte para a página inicial.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-sunflower-100 px-4 py-2.5 text-sm font-medium text-sunflower-700">
                    <HugeiconsIcon icon={Alert02Icon} size={18} />
                    Erro 404 — endereço não encontrado
                </div>

                <Button icon={Home01Icon} className="w-full" onClick={() => navigate("/")}>
                    Voltar ao início
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
