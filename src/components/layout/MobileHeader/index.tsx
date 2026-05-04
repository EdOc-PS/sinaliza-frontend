import { FavouriteIcon, Rotate01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const MobileHeader = () => {
    return (
        <header className="lg:hidden bg-cloud-100 p-4 flex items-center justify-between">
            {/* Logo */}
            <img src="/logo/logo-simples.png" alt="Logo" className="w-10 h-10" />

            {/* Icons */}
            <div className="flex gap-4 items-center rounded-xl bg-white ">
                <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-cloud-200 transition-colors">
                    <HugeiconsIcon icon={Rotate01Icon} size={20} className="text-cloud-500" />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-cloud-200 transition-colors">
                    <HugeiconsIcon icon={FavouriteIcon} size={20} className="text-cloud-500" />
                </button>
            </div>
        </header>
    );
};

export default MobileHeader;
