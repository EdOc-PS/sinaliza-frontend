import Spinner from "@components/ui/Spinner";

// Fallback do Suspense enquanto o chunk da rota é baixado.
// Ocupa a altura da viewport para o layout não "pular" quando a página entra.
export const PageLoader = () => (
    <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} color="#6B7280" />
    </div>
);

export default PageLoader;
