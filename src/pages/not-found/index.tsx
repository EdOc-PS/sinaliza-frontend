import { useNavigate } from "react-router-dom";
import { Home01Icon } from "@hugeicons/core-free-icons";

import AuthBackground from "@components/layout/AuthBackground";
import Button from "@components/ui/Button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
            <AuthBackground />

            <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
                <img src="/src/assets/images/404.webp" alt="Página não encontrada" className="w-full max-w-sm object-contain" />

                <div className="flex flex-col gap-2">
                    <h1 className="font-baskerville text-2xl font-bold text-cloud-600 sm:text-3xl">
                        Página não <span className="italic text-campfire-500">encontrada</span>
                    </h1>
                    <p className="text-sm leading-relaxed text-cloud-500 sm:text-base">
                        O endereço que você tentou acessar não existe ou foi movido.
                    </p>
                </div>

                <Button icon={Home01Icon} onClick={() => navigate("/")}>
                    Voltar ao início
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
