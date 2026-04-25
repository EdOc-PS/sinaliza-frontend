interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    return (
        <div className="flex justify-center gap-2 mb-8">
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
