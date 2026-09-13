import type { APIResponse } from "@api/requests";

/**
 * Ponte entre a camada de requests e o TanStack Query.
 *
 * Os helpers (`GetRequest`, `PostRequest`, ...) nunca lançam: eles capturam o
 * erro e devolvem `{ success: false, message }`. Já o TanStack Query só marca
 * uma query/mutation como falha se a função **lançar**. Sem este adaptador
 * toda requisição pareceria bem-sucedida e `isError` nunca seria verdadeiro.
 *
 * Uso:
 *   queryFn: () => unwrap(GetRequest<ClassroomCardData[]>(CLASSROOMS.MINE()))
 */
export async function unwrap<T>(request: Promise<APIResponse<T>>): Promise<T> {
    const response = await request;

    if (!response.success) {
        throw new Error(response.message || "Não foi possível completar a requisição.");
    }

    return response.object as T;
}
