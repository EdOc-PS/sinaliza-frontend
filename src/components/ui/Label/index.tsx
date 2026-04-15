interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
}

const Label = ({ htmlFor, children }: LabelProps) => {
    return (
        <label htmlFor={htmlFor} className="text-md font-semibold text-cloud-500">
            {children}
        </label>
    )
}

export default Label;
