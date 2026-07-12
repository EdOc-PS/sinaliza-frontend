
import { ChevronDown, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SelectProps {
    id?: string;
    onChange?: (value: string) => void;
    value?: string;
    icon?: IconSvgElement;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
}


const Select = ({
    id,
    onChange,
    value = "",
    icon,
    options,
    placeholder = "Selecione uma opção",
    disabled = false,
}: SelectProps) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div ref={rootRef} className="relative">
            <div
                onClick={() => setOpen((current) => !current)}
                className="cursor-pointer flex items-center gap-3 rounded-3xl border-2 border-cloud-400/10 bg-cloud-100 px-2.5 py-2.5 transition-colors focus-within:border-cloud-500 focus-within:text-cloud-500 focus-within:font-semibold">
                {icon && (
                    <div className="rounded-2xl bg-cloud-300/80 p-2">
                        <HugeiconsIcon
                            icon={icon}
                            className="shrink-0 text-cloud-500"
                            size={26}
                        />
                    </div>
                )}

                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    className="flex cursor-pointer w-full items-center justify-between gap-3 bg-transparent text-left text-neutral-900 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className={selectedOption ? "text-neutral-900" : "text-neutral-500"}>
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <HugeiconsIcon icon={ChevronDown} className={`shrink-0 text-cloud-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} size={22} />
                </button>
            </div>

            {open && !disabled && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border-2 border-cloud-400/10 bg-white shadow-xl">
                    <div className="max-h-56 overflow-auto p-2 flex flex-col gap-1">
                        {options.map((option) => {
                            const selected = option.value === value;

                            return (
                                <button
                                    key={option.value || option.label}
                                    type="button"
                                    disabled={option.disabled}
                                    onClick={() => {
                                        if (option.disabled) return;
                                        onChange?.(option.value);
                                        setOpen(false);
                                    }}
                                    className={`flex w-fullitems-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${selected ? "bg-cloud-300/80 text-cloud-500" : "text-neutral-900 hover:bg-cloud-100"} disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    <span>{option.label}</span>
                                    {selected && <span className="text-sm font-semibold text-cloud-500">
                                        <HugeiconsIcon icon={Tick01Icon} />
                                    </span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Select;
