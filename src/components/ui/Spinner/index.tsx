import { Loading01Icon, Loading02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface SpinnerProps {
    size?: number;
    className?: string;
    color?: string;
}

const Spinner = ({ size = 24, className = "", color }: SpinnerProps) => {
    return (
        <>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .spinner-hourglass {
                    animation: spin 0.8s linear infinite;
                    display: inline-flex;
                }
            `}</style>
            <span className={`inline-flex items-center justify-center ${className}`}>
                <HugeiconsIcon
                    icon={Loading02Icon}
                    size={size}
                    className="spinner-hourglass"
                    color={color}
                />
            </span>
        </>
    );
};

export default Spinner;
