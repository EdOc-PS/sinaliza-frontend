import { useRef, useState } from "react";
import { Cancel01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

interface InputImageProps {
    /** URL de preview inicial (ex: imagem já salva em modo edição) */
    initialPreview?: string;
    /** Texto auxiliar exibido abaixo do título na drop zone */
    description?: string;
    onChange: (file: File | null) => void;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const InputImage = ({ initialPreview, description, onChange }: InputImageProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selected: File) => {
        if (!ACCEPTED.includes(selected.type)) {
            toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
            return;
        }
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        onChange(selected);
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    return (
        <div className="flex flex-col gap-0">
            {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-cloud-200 bg-neutral-50">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </button>
                    {file && (
                        <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                            {file.name}
                        </span>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`
                        w-full py-8 rounded-2xl border-2 border-dashed cursor-pointer
                        flex flex-col items-center justify-center gap-2 transition-all
                        ${dragging
                            ? "border-campfire-400 bg-campfire-50"
                            : "border-cloud-400/30 bg-cloud-100 hover:border-sunflower-400 hover:bg-sunflower-100"
                        }
                    `}
                >
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-campfire-200">
                        <HugeiconsIcon icon={Image01Icon} size={24} className="text-campfire-500" />
                    </span>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-cloud-700">Enviar imagem (PNG ou JPG)</p>
                        {description && (
                            <p className="text-xs text-neutral-400">{description}</p>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
        </div>
    );
};

export default InputImage;
