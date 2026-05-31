interface ProgressBarProps {
    currentStep: number
    totalSteps: number
    style?: React.CSSProperties
}

const ProgressBar = ({ currentStep, totalSteps, style }: ProgressBarProps) => {
    return (
        <div className="flex gap-2" style={style}>
            {Array.from({ length: totalSteps }).map((_, step) => (
                <div
                    key={step}
                    className={`h-2 rounded-full transition-all ${
                        step === currentStep
                            ? 'bg-green-500 w-8'
                            : currentStep > step
                            ? 'bg-green-500 w-6'
                            : 'bg-neutral-200 w-6'
                    }`}
                />
            ))}
        </div>
    )
}

export default ProgressBar
