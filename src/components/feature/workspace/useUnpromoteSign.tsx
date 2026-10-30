import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cancel02Icon } from "@hugeicons/core-free-icons";

import { PatchRequest } from "@requests";
import { SIGNS } from "@routes/signs";
import { queryKeys } from "@/config/query/queryKeys";
import { unwrap } from "@/config/query/unwrap";
import ConfirmModal from "@components/layout/ConfirmModal";
import Label from "@components/ui/Label";
import InputText from "@components/ui/InputText";
import { LIMITS } from "@lib/validation/limits";

interface SignRef {
    id: string;
    name: string;
}

// Fluxo "Remover do glossário" (só gestor): confirmação + chamada + atualização
// das listas. Devolve `ask` para abrir a confirmação e o `modal` para renderizar.
export const useUnpromoteSign = (onDone?: () => void) => {
    const queryClient = useQueryClient();
    const [target, setTarget] = useState<SignRef | null>(null);
    // Motivo vai por email para quem cadastrou o sinal
    const [reason, setReason] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: (sign: SignRef) => unwrap(PatchRequest(SIGNS.UNPROMOTE(sign.id), { reason: reason.trim() })),
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
            onConfirm={() => target && reason.trim() && mutate(target)}
            confirmDisabled={!reason.trim()}
            loading={isPending}
            loadingText="Removendo"
            icon={Cancel02Icon}
            title={<>Remover do <span className="text-salmon-600 italic">glossário</span>?</>}
            description={
                <>
                    O sinal <b>{target?.name}</b> deixa de ser público e volta a ficar só nas turmas.
                    As disciplinas do glossário associadas a ele são desfeitas. Quem cadastrou o sinal recebe o motivo por email.
                </>
            }
            confirmText="Remover do glossário"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="unpromote-reason" isRequired>Motivo</Label>
                <InputText
                    id="unpromote-reason"
                    value={reason}
                    onChange={setReason}
                    maxLength={LIMITS.REVIEW_REASON}
                    height={96}
                    placeholder="Ex: sinal duplicado no glossário."
                />
            </div>
        </ConfirmModal>
    );

    return { ask: (sign: SignRef) => { setReason(""); setTarget(sign); }, modal };
};

export default useUnpromoteSign;
