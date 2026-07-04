import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon, Mail01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";

import { GetRequest } from "@requests";
import { USERS } from "@routes/users";
import type { User } from "@api/requests";

import Modal from "@components/ui/Modal";
import Spinner from "@components/ui/Spinner";
import { RoleBadge } from "@components/ui/RoleBadge";
import { EducatorForm } from "@components/feature/educators/EducatorForm";

const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const EducatorsPage = () => {
    const [loading, setLoading] = useState(true);
    const [educators, setEducators] = useState<User[]>([]);
    const [formModal, setFormModal] = useState(false);

    const loadEducators = useCallback(async () => {
        setLoading(true);
        try {
            const response = await GetRequest<User[]>(USERS.LIST());
            if (!response.success) { toast.error("Falha ao carregar educadores: " + response.message); return; }
            setEducators((response.object ?? []).filter((u) => u.roles?.includes("EDUCATOR")));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEducators();
    }, [loadEducators]);

    return (
        <>
            <section className="flex flex-col gap-8">
                {/* Cabeçalho */}
                <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100">
                            <HugeiconsIcon icon={UserMultiple02Icon} size={26} className="text-lime-700" />
                        </div>
                        <div>
                            <h1 className="font-baskerville text-2xl font-bold text-cloud-600">Educadores</h1>
                            <p className="text-sm text-neutral-500">Cadastre e gerencie professores e intérpretes</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setFormModal(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-cloud-500 px-5 py-3 font-bold text-white transition-colors hover:bg-cloud-600"
                    >
                        <HugeiconsIcon icon={AddCircleIcon} size={20} />
                        Novo educador
                    </button>
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size={32} color="#6B7280" />
                    </div>
                ) : educators.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cloud-300 py-20 text-center">
                        <HugeiconsIcon icon={UserMultiple02Icon} size={40} className="text-cloud-300" />
                        <div>
                            <p className="text-sm font-medium text-cloud-500">Nenhum educador cadastrado</p>
                            <p className="mt-1 text-xs text-neutral-400">Clique em "Novo educador" para cadastrar o primeiro.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <span className="text-xs text-neutral-400">{educators.length} educador{educators.length > 1 ? "es" : ""}</span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {educators.map((edu) => (
                                <div key={edu.id} className="flex items-center gap-3 rounded-3xl bg-white p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-campfire-100 font-baskerville font-bold text-campfire-600">
                                        {initials(edu.name)}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate font-medium text-cloud-600">{edu.name}</span>
                                        <span className="flex items-center gap-1 truncate text-xs text-neutral-400">
                                            <HugeiconsIcon icon={Mail01Icon} size={13} />
                                            {edu.email}
                                        </span>
                                    </div>
                                    <RoleBadge role="EDUCATOR" educatorType={edu.educatorType} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Modal de cadastro */}
            <Modal open={formModal} onClose={() => setFormModal(false)} size="lg">
                <EducatorForm
                    onClose={() => setFormModal(false)}
                    onSuccess={() => { setFormModal(false); loadEducators(); }}
                />
            </Modal>
        </>
    );
};

export default EducatorsPage;
