import { ChevronDown, Tick01Icon, Cancel02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    id?: string;
    icon?: IconSvgElement;
    options: Option[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

const MultiSelect = ({
    id,
    icon,
    options,
    value,
    onChange,
    placeholder = "Selecione uma ou mais opções",
    disabled = false,
}: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const toggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    const remove = (val: string) => onChange(value.filter((v) => v !== val));

    const selectedOptions = options.filter((o) => value.includes(o.value));

    return (
        <div ref={rootRef} className="relative">
            <div
                onClick={() => { if (!disabled) setOpen((c) => !c); }}
                className="flex w-full cursor-pointer flex-wrap items-center gap-2 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5 transition-colors focus-within:border-cloud-500"
            >
                {icon && (
                    <div className="shrink-0 rounded-2xl bg-cloud-300/80 p-2">
                        <HugeiconsIcon icon={icon} className="shrink-0 text-cloud-500" size={26} />
                    </div>
                )}

                {/* Chips das opções selecionadas */}
                {selectedOptions.map((opt) => (
                    <span
                        key={opt.value}
                        className="flex flex-row-reverse items-center gap-1 rounded-full bg-campfire-200 px-2.5 py-1 text-sm font-semibold text-campfire-800"
                    >
                        {opt.label}
                        <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); remove(opt.value); }}
                            className="cursor-pointer text-campfire-700 hover:text-campfire-900"
                        >
                            <HugeiconsIcon icon={Cancel02Icon} size={18} />
                        </button>
                    </span>
                ))}

                {selectedOptions.length === 0 && (
                    <span className="flex-1 pl-1 text-neutral-500">{placeholder}</span>
                )}

                <button id={id} type="button" disabled={disabled} className="ml-auto shrink-0 cursor-pointer">
                    <HugeiconsIcon icon={ChevronDown} className={`shrink-0 text-cloud-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} size={22} />
                </button>
            </div>

            {open && !disabled && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border-2 border-cloud-400/10 bg-white shadow-xl">
                    <div className="flex max-h-56 flex-col gap-1 overflow-auto p-2">
                        {options.length === 0 && (
                            <span className="px-4 py-3 text-sm text-neutral-400">Nenhuma opção disponível</span>
                        )}
                        {options.map((option) => {
                            const selected = value.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggle(option.value)}
                                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${selected ? "bg-cloud-300/80 text-cloud-500" : "text-neutral-900 hover:bg-cloud-100"}`}
                                >
                                    <span>{option.label}</span>
                                    {selected && (
                                        <span className="text-cloud-500">
                                            <HugeiconsIcon icon={Tick01Icon} size={18} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
