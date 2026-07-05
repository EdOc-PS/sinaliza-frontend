import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { useAuth } from "@context/AuthContext";
import AuthBackground from "@components/layout/AuthBackground";
import Button from "@components/ui/Button";

const PendingPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
            <AuthBackground />

            <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border-2 border-neutral-200 bg-white p-8 text-center sm:p-10">
                <img src="/src/assets/images/pendent.webp" alt="" className="h-40 w-40 object-contain sm:h-48 sm:w-48" />

                <div className="flex flex-col gap-2">
                    <h1 className="font-baskerville text-2xl font-bold text-cloud-600 sm:text-3xl">
                        Solicitação <span className="italic text-campfire-500 font-baskerville">em análise</span>
                    </h1>
                    <p className="text-sm leading-relaxed text-cloud-500 sm:text-base">
                        Recebemos seu cadastro! Um educador da instituição já está cuidando da sua solicitação de acesso.
                        Assim que tudo estiver certo, sua conta será liberada e você poderá entrar normalmente.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-sunflower-100 px-4 py-2.5 text-sm font-medium text-sunflower-700">
                    <HugeiconsIcon icon={UserGroupIcon} size={18} />
                    Aguardando aprovação de um educador
                </div>

                <Button variant="outline" icon={Logout01Icon} className="w-full" onClick={handleLogout}>
                    Voltar para o login
                </Button>
            </div>
        </div>
    );
};

export default PendingPage;
