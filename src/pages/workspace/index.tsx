import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GetRequest } from "@requests";
import { HAND_CONFIG } from "@/config/api/apiRoutes/handConfigs";
import Spinner from "@components/ui/Spinner";

export interface HandConfigTypeForm {
    name: string;
    imgUrl?: string;
}

const WorkspacePage = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [handConfigs, setHandConfigs] = useState<HandConfigTypeForm[]>([]);

    const fetchAllHandConfigs = async () => {
        setLoading(true);
        try {
            const response = await GetRequest<HandConfigTypeForm[]>(HAND_CONFIG.FIND_ALL());
            if (!response.success) toast.error("Falha ao obter configurações de mão: " + response.message);
            setHandConfigs(response.object || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllHandConfigs();
    }, []);

    return (
        <>
            <section className="flex flex-col gap-10">
                <div className="bg-white rounded-3xl p-6">
                    <p className="text-xl sm:text-4xl font-bold text-cloud-500 font-baskerville">
                        Ambiente de
                        <span className="font-baskerville text-campfire-500 italic"> Trabalho</span>
                    </p>
                    <p className="text-neutral-600 text-md">Sinais · Configuração de Mão</p>
                </div>

                <div className="bg-white rounded-3xl p-6">
                    <div className="mb-4">
                        <h1 className="text-lg font-baskerville text-cloud-500">Teclado Visual de Mão</h1>
                        <p className="text-sm text-neutral-600">Gerencie a configuração de mão</p>
                    </div>

                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-10">
                            <Spinner size={32} color="#6B7280" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {handConfigs.map((config) => (
                                <div key={config.name} className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-baskerville text-cloud-500">{config.name}</h2>
                                    {config.imgUrl && (
                                        <img src={config.imgUrl} alt={config.name} className="w-full h-auto rounded-md" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default WorkspacePage;
