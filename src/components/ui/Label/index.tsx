import { RemoveSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface LabelProps {
    htmlFor?: string;
    isOptional?: boolean;
    children: React.ReactNode;
}

const Label = ({ htmlFor, isOptional, children }: LabelProps) => {
    return (
        <div className="flex justify-between">
            <label htmlFor={htmlFor} className="text-md font-semibold text-cloud-500">
                {children}
            </label>
            {isOptional && (
                <div className="flex gap-2 flex-row-reverse">
                    <HugeiconsIcon icon={RemoveSquareIcon} size={18} className="text-cloud-400" />
                    <p className="text-sm font-medium text-cloud-400">
                        Opcional
                    </p>
                </div>
            )}
        </div>

    )
}

export default Label;
