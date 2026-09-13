import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Rótulo opcional por query/mutation, usado na mensagem de erro.
 *
 *   useQuery({ ..., meta: { errorMessage: "Falha ao carregar favoritos" } })
 */
declare module "@tanstack/react-query" {
    interface Register {
        queryMeta: { errorMessage?: string };
        mutationMeta: { errorMessage?: string };
    }
}

/**
 * Cache global de dados do servidor.
 *
 * Fica fora do React: por isso os dados sobrevivem à navegação entre páginas —
 * que é justamente o que elimina o spinner ao voltar para uma tela já visitada.
 */
export const queryClient = new QueryClient({
    // O `onError` de query saiu do componente na v5. Centralizar aqui evita
    // repetir um useEffect de toast em cada tela, e garante que nenhuma falha
    // passe silenciosa.
    queryCache: new QueryCache({
        onError: (error, query) => {
            const label = query.meta?.errorMessage ?? "Falha ao carregar dados";
            toast.error(`${label}: ${error.message}`);
        },
    }),

    // Mutations avisam o erro por padrão, mas um `onError` próprio na mutation
    // continua funcionando — os dois rodam.
    mutationCache: new MutationCache({
        onError: (error, _vars, _ctx, mutation) => {
            if (mutation.options.onError) return; // já tratado no local da chamada
            const label = mutation.meta?.errorMessage ?? "Não foi possível concluir a ação";
            toast.error(`${label}: ${error.message}`);
        },
    }),

    defaultOptions: {
        queries: {
            // Por 1 minuto o dado é considerado fresco e a tela nem chega a
            // bater no servidor ao ser reaberta. Listas que mudam pouco
            // (categorias, configurações de mão) podem subir isso na própria query.
            staleTime: 60_000,

            // Tempo que o cache sobrevive sem nenhuma tela usando aquela chave.
            gcTime: 5 * 60_000,

            // O app roda em celular dentro da sala de aula: uma tentativa extra
            // cobre oscilação de rede sem deixar o usuário esperando demais.
            retry: 1,

            // Desligado de propósito: com isso ligado, cada vez que o usuário
            // volta para a aba o app dispara refetch em tudo que está montado.
            refetchOnWindowFocus: false,
        },
    },
});
