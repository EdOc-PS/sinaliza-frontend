import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Logout01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { useAuth } from "@context/AuthContext";
import AuthBackground from "@components/layout/AuthBackground";
import Button from "@components/ui/Button";
import pendingImg from "@/assets/images/pendent.webp";

const PendingPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const rejected = user?.approvalStatus === "REJECTED";

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
            <AuthBackground />

            <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border-2 border-neutral-200 bg-white p-8 text-center sm:p-10">
                <img src={pendingImg} alt="" className="h-40 w-40 object-contain sm:h-48 sm:w-48" />

                {rejected ? (
                    <>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-baskerville text-2xl font-bold text-cloud-600 sm:text-3xl">
                                Solicitação <span className="italic text-salmon-500 font-baskerville">recusada</span>
                            </h1>
                            <p className="text-sm leading-relaxed text-cloud-500 sm:text-base">
                                Um gestor da instituição analisou seu cadastro e, por enquanto, ele não foi aprovado.
                                Se acredita que houve um engano, procure a coordenação do seu curso — a decisão pode ser revista.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl bg-salmon-100 px-4 py-2.5 text-sm font-medium text-salmon-700">
                            <HugeiconsIcon icon={Cancel01Icon} size={18} />
                            Acesso não liberado
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-2">
                            <h1 className="font-baskerville text-2xl font-bold text-cloud-600 sm:text-3xl">
                                Solicitação <span className="italic text-campfire-500 font-baskerville">em análise</span>
                            </h1>
                            <p className="text-sm leading-relaxed text-cloud-500 sm:text-base">
                                Recebemos seu cadastro! Um gestor da instituição já está cuidando da sua solicitação de acesso.
                                Assim que tudo estiver certo, você receberá um email e poderá entrar normalmente.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl bg-sunflower-100 px-4 py-2.5 text-sm font-medium text-sunflower-700">
                            <HugeiconsIcon icon={UserGroupIcon} size={18} />
                            Aguardando aprovação de um gestor
                        </div>
                    </>
                )}

                <Button variant="outline" icon={Logout01Icon} className="w-full" onClick={handleLogout}>
                    Voltar para o login
                </Button>
            </div>
        </div>
    );
};

export default PendingPage;
