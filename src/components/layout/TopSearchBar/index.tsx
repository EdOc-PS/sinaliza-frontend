import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Search01Icon, SignLanguageCIcon } from "@hugeicons/core-free-icons";

import Input from "@components/ui/Input";
import Select from "@components/ui/Select";
import HandConfigPicker from "@components/feature/workspace/HandConfigPicker";
import { GRAMMATICAL_META } from "@lib/constants/grammaticalClass";

const grammaticalOptions = [
    { value: "", label: "Todas as classes gramaticais" },
    ...Object.entries(GRAMMATICAL_META).map(([value, meta]) => ({ value, label: meta.label })),
];

const TopSearchBar = () => {
    const navigate = useNavigate();
    const rootRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [handConfigId, setHandConfigId] = useState("");
    const [grammaticalClass, setGrammaticalClass] = useState("");

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const submit = () => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (handConfigId) params.set("handConfigId", handConfigId);
        if (grammaticalClass) params.set("grammaticalClass", grammaticalClass);
        setOpen(false);
        navigate(`/search?${params.toString()}`);
    };

    const activeFilters = (handConfigId ? 1 : 0) + (grammaticalClass ? 1 : 0);

    return (
        <div ref={rootRef} className="relative">
            {/* Campo de texto */}
            <div className="relative">
                <Input
                    icon={Search01Icon}
                    wrapperClassName="bg-white"
                    value={search}
                    onChange={(value) => setSearch(value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                    placeholder="Buscar sinal..."
                />
                {activeFilters > 0 && (
                    <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg bg-campfire-100 px-2 py-0.5 text-xs font-semibold text-campfire-600 sm:flex">
                        {activeFilters} filtro{activeFilters > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Dropdown com teclado de mão + classe gramatical */}
            {open && (
                <div className="dropdown-slide absolute left-0 right-0 top-full z-40 mt-2 flex flex-col gap-4 rounded-3xl border-2 border-cloud-400/10 bg-white p-4 shadow-xl">
                    {/* Teclado de configuração de mão */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="flex items-center gap-2 text-sm font-semibold text-cloud-500">
                                <HugeiconsIcon icon={SignLanguageCIcon} size={18} />
                                Configuração de mão
                            </span>
                            {handConfigId && (
                                <button
                                    type="button"
                                    onClick={() => setHandConfigId("")}
                                    className="flex items-center gap-1 text-xs font-medium text-cloud-400 transition-colors hover:text-cloud-600"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                    Limpar
                                </button>
                            )}
                        </div>
                        <HandConfigPicker
                            value={handConfigId}
                            onChange={setHandConfigId}
                            compact
                            gridClassName="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-1.5"
                            itemsPerPage={24}
                        />
                    </div>

                    {/* Classe gramatical */}
                    <Select
                        icon={SignLanguageCIcon}
                        options={grammaticalOptions}
                        value={grammaticalClass}
                        onChange={setGrammaticalClass}
                        placeholder="Classe gramatical"
                    />

                    {/* Botão buscar */}
                    <button
                        type="button"
                        onClick={submit}
                        className="w-full rounded-2xl bg-cloud-500 py-3 font-bold text-white transition-colors hover:bg-cloud-600"
                    >
                        Buscar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopSearchBar;
