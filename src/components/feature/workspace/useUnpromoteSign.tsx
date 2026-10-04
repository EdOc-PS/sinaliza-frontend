import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cancel02Icon } from "@hugeicons/core-free-icons";

import { PatchRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import ConfirmModal from "@components/layout/ConfirmModal";

interface SignRef {
    id: string;
    name: string;
}

// Fluxo "Remover do glossário" (só gestor): confirmação + chamada + atualização
// das listas. Devolve `ask` para abrir a confirmação e o `modal` para renderizar.
export const useUnpromoteSign = (onDone?: () => void) => {
    const queryClient = useQueryClient();
    const [target, setTarget] = useState<SignRef | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (sign: SignRef) => unwrap(PatchRequest(SIGNS.UNPROMOTE(sign.id), {})),
        onSuccess: (_data, sign) => {
            toast.success(`"${sign.name}" saiu do glossário global`);
            setTarget(null);
            queryClient.invalidateQueries({ queryKey: queryKeys.signs.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.glossary.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            onDone?.();
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const modal = (
        <ConfirmModal
            open={!!target}
            onClose={() => setTarget(null)}
            onConfirm={() => target && mutate(target)}
            loading={isPending}
            loadingText="Removendo"
            icon={Cancel02Icon}
            title={<>Remover do <span className="text-salmon-600 italic">glossário</span>?</>}
            description={
                <>
                    O sinal <b>{target?.name}</b> deixa de ser público e volta a ficar só nas turmas.
                    As disciplinas do glossário associadas a ele são desfeitas.
                </>
            }
            confirmText="Remover do glossário"
        />
    );

    return { ask: (sign: SignRef) => setTarget(sign), modal };
};

export default useUnpromoteSign;
