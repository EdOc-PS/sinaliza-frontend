import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export interface NavTabItem<T extends string> {
    key: T;
    label: string;
    icon?: IconSvgElement;
}

interface NavTabsProps<T extends string> {
    items: NavTabItem<T>[];
    endItems?: NavTabItem<T>[];
    active: T;
    onChange: (key: T) => void;
}

function NavTabs<T extends string>({ items, endItems, active, onChange }: NavTabsProps<T>) {
    const renderTab = (item: NavTabItem<T>) => (
        <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-3xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-5 sm:py-3 ${
                active === item.key
                    ? "bg-campfire-100 text-campfire-500"
                    : "text-neutral-400 hover:text-cloud-500 hover:bg-cloud-100"
            }`}
        >
            {item.icon && <HugeiconsIcon icon={item.icon} size={18} className="shrink-0" />}
            {item.label}
        </button>
    );

    return (
        <div className="bg-white rounded-3xl px-1 py-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
                {items.map(renderTab)}
            </div>
            {endItems && endItems.length > 0 && (
                <div className="flex items-center gap-1 ml-auto pl-1">
                    {endItems.map(renderTab)}
                </div>
            )}
        </div>
    );
}

export default NavTabs;
