import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Medal06Icon, MortarboardIcon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { GLOSSARY_DISCIPLINES } from "@routes/glossaryDisciplines";
import type { GlossaryDisciplineSlim } from "@lib/constants/glossaryDiscipline";

import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";
import Label from "@components/ui/Label";
import MultiSelect from "@components/ui/MultiSelect";

interface PromoteSignModalProps {
    open: boolean;
    onClose: () => void;
    /** Recebe as disciplinas do glossário selecionadas (pode ser vazio) */
    onConfirm: (glossaryDisciplineIds: string[]) => void;
    loading?: boolean;
    signName?: string;
}

// Modal de confirmação de promoção do sinal ao glossário global.
// Permite associar o sinal a nenhuma, uma ou várias disciplinas fixas do glossário.
const PromoteSignModal = ({ open, onClose, onConfirm, loading = false, signName }: PromoteSignModalProps) => {
    const [disciplines, setDisciplines] = useState<GlossaryDisciplineSlim[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    const loadDisciplines = useCallback(async () => {
        const res = await GetRequest<GlossaryDisciplineSlim[]>(GLOSSARY_DISCIPLINES.LIST());
        if (!res.success) { toast.error("Falha ao carregar disciplinas do glossário: " + res.message); return; }
        setDisciplines(res.object ?? []);
    }, []);

    // Carrega as disciplinas e limpa a seleção sempre que o modal abre
    useEffect(() => {
        if (!open) return;
        setSelected([]);
        loadDisciplines();
    }, [open, loadDisciplines]);

    const options = disciplines.map((d) => ({ value: d.id, label: d.name }));

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <div className="flex flex-col gap-6 items-center">
                {/* Ícone */}
                <div className="flex justify-center pt-2">
                    <div className="w-16 h-16 rounded-3xl bg-campfire-100 flex items-center justify-center">
                        <HugeiconsIcon icon={Medal06Icon} size={32} className="text-campfire-600" />
                    </div>
                </div>

                {/* Título */}
                <div className="text-center text-2xl font-semibold font-baskerville text-cloud-700">
                    Promover <span className="text-campfire-600 italic">Sinal</span>?
                </div>

                {/* Descrição */}
                <p className="text-sm text-neutral-600 text-center leading-relaxed w-5/6">
                    {signName ? (
                        <>O sinal <span className="font-semibold text-campfire-600 italic">{signName}</span> se tornará </>
                    ) : (
                        <>O sinal se tornará </>
                    )}
                    <b>público</b> no glossário global após a aprovação de um gestor. Ele continuará disponível
                    normalmente nas disciplinas.
                </p>

                {/* Associação a disciplinas do glossário (opcional) */}
                <div className="flex w-full flex-col gap-1.5">
                    <Label htmlFor="promote-glossary-disciplines" isOptional>
                        Disciplinas do glossário
                    </Label>
                    <MultiSelect
                        id="promote-glossary-disciplines"
                        icon={MortarboardIcon}
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        placeholder={options.length ? "Associe a uma ou mais disciplinas" : "Nenhuma disciplina cadastrada"}
                        disabled={options.length === 0}
                    />
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-1 w-full">
                    <Button type="button" variant="outline" className="w-1/3" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="campfire"
                        className="flex-1"
                        onClick={() => onConfirm(selected)}
                        loading={loading}
                        loadingText="Enviando..."
                    >
                        Enviar para aprovação
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PromoteSignModal;
