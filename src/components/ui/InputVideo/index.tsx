import { useRef, useState } from "react";
import { Cancel02Icon, Video01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { validateUpload } from "@lib/upload/fileSecurity";

interface InputVideoProps {
    initialPreview?: string;
    description?: string;
    disabled?: boolean;
    onChange: (file: File | null) => void;
}

const InputVideo = ({ initialPreview, description, disabled = false, onChange }: InputVideoProps) => {
    const [file, setFile]         = useState<File | null>(null);
    const [preview, setPreview]   = useState<string | undefined>(initialPreview);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (selected: File) => {
        const result = await validateUpload(selected, "video");
        if (!result.ok || !result.file) {
            toast.error(result.error ?? "Arquivo inválido.");
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        setFile(result.file);
        setPreview(undefined);
        onChange(result.file);
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(undefined);
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
        <div>
            {file || preview ? (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-cloud-200 bg-neutral-50">
                    <div className="flex items-center gap-2 min-w-0">
                        <HugeiconsIcon icon={Video01Icon} size={18} className="text-salmon-500 shrink-0" />
                        <span className="text-sm text-cloud-700 font-medium truncate">
                            {file ? file.name : "Vídeo atual"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1.5 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50 shrink-0"
                    >
                        <HugeiconsIcon icon={Cancel02Icon} size={14} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => { if (!disabled) inputRef.current?.click(); }}
                    onDragOver={(e) => { if (disabled) return; e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { if (disabled) { e.preventDefault(); return; } handleDrop(e); }}
                    className={`
                        w-full py-8 rounded-2xl border-2 border-dashed
                        flex flex-col items-center justify-center gap-2 transition-all
                        ${disabled
                            ? "border-cloud-400/20 bg-cloud-100/50 opacity-50 cursor-not-allowed"
                            : dragging
                                ? "border-salmon-400 bg-salmon-100 cursor-pointer"
                                : "border-cloud-400/30 bg-cloud-100 hover:border-salmon-400 hover:bg-salmon-100 cursor-pointer"
                        }
                    `}
                >
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-salmon-200">
                        <HugeiconsIcon icon={Video01Icon} size={24} className="text-salmon-500" />
                    </span>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-cloud-700">Enviar vídeo (MP4, WebM, MOV)</p>
                        {description && (
                            <p className="text-xs text-neutral-400">{description}</p>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".mp4,.webm,.mov,.ogg"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
        </div>
    );
};

export default InputVideo;
