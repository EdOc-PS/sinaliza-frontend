interface ProgressBarProps {
    currentStep: number
    totalSteps: number
    style?: React.CSSProperties
    onStepClick?: (step: number) => void
}

const ProgressBar = ({ currentStep, totalSteps, style, onStepClick }: ProgressBarProps) => {
    const clickable = !!onStepClick

    return (
        <div className="flex gap-2" style={style}>
            {Array.from({ length: totalSteps }).map((_, step) => (
                <button
                    key={step}
                    type="button"
                    disabled={!clickable}
                    onClick={() => onStepClick?.(step)}
                    aria-label={`Ir para etapa ${step + 1}`}
                    className={`h-2 rounded-full transition-all ${clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${
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
