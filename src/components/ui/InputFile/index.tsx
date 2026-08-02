import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel02Icon, DocumentAttachmentIcon } from "@hugeicons/core-free-icons";

interface InputFileProps {
    /** Extensões aceitas no seletor do sistema (ex: ".pdf,.png") */
    accept?: string;
    description?: string;
    onChange: (file: File | null) => void;
}

const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
};

// Upload de documento (PDF ou imagem) com drag-and-drop — mesmo padrão do InputImage,
// mas sem preview, já que PDF não renderiza como miniatura.
const InputFile = ({ accept = ".pdf,.png,.jpg,.jpeg,.webp", description, onChange }: InputFileProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (selected: File | null) => {
        setFile(selected);
        onChange(selected);
    };

    const clear = () => {
        handleFile(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-2">
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped) handleFile(dropped);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-6 transition-colors ${
                    dragging ? "border-sky-500 bg-sky-100" : "border-cloud-400/30 bg-cloud-100 hover:border-sky-400"
                }`}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                    <HugeiconsIcon icon={DocumentAttachmentIcon} size={24} className="text-sky-600" />
                </div>
                <p className="text-sm font-medium text-cloud-500">
                    Arraste o arquivo ou <span className="text-sky-600">clique para escolher</span>
                </p>
                {description && <p className="text-xs text-neutral-400">{description}</p>}
            </div>

            {/* Arquivo escolhido */}
            {file && (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-cloud-400/10 bg-white p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cloud-100">
                        <HugeiconsIcon icon={DocumentAttachmentIcon} size={18} className="text-cloud-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-cloud-600">{file.name}</p>
                        <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={clear}
                        aria-label="Remover arquivo"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-cloud-400 transition-colors hover:bg-salmon-100 hover:text-salmon-600"
                    >
                        <HugeiconsIcon icon={Cancel02Icon} size={18} />
                    </button>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
        </div>
    );
};

export default InputFile;
