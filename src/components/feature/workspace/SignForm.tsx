import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import CheckInput from "@components/ui/CheckInput";
import ProgressBar from "@components/layout/ProgressBar";

import {
    ArrowLeft01Icon,
    Cancel01Icon,
    Image01Icon,
    LayersIcon,
    LinkSquare02Icon,
    MusicNote01Icon,
    SignLanguageCIcon,
    TagsIcon,
    TextSelectIcon,
    Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { GenericOption } from "@interfaces";
import { SIGNS } from "@routes/signs";
import { HAND_CONFIG } from "@routes/handConfigs";
import { DISCIPLINES } from "@routes/disciplines";
import { GetRequest, PostFormDataRequest } from "@requests";

interface HandConfigOption {
    id: string;
    name: string;
    imgUrl: string;
}

interface DisciplineOption {
    id: string;
    name: string;
}

interface SignFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ACCEPTED_VIDEO = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const ACCEPTED_IMAGE = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const SignForm = ({ onClose, onSuccess }: SignFormProps) => {
    const [view, setView] = useState(0);

    // Campos
    const [name, setName]                         = useState("");
    const [grammaticalClass, setGrammaticalClass] = useState("");
    const [handConfigId, setHandConfigId]         = useState("");
    const [disciplineId, setDisciplineId]         = useState("");
    const [examplePt, setExamplePt]               = useState("");
    const [exampleLibras, setExampleLibras]       = useState("");
    const [movementDesc, setMovementDesc]         = useState("");
    const [tags, setTags]                         = useState<string[]>([]);
    const [anotherUrl, setAnotherUrl]             = useState("");
    const [videoFile, setVideoFile]               = useState<File | null>(null);
    const [imageFile, setImageFile]               = useState<File | null>(null);
    const [imagePreview, setImagePreview]         = useState<string | null>(null);

    // UI
    const [loading, setLoading]                       = useState(false);
    const [loadingOptions, setLoadingOptions]         = useState(false);
    const [grammaticalOptions, setGrammaticalOptions] = useState<GenericOption[]>([]);
    const [handConfigOptions, setHandConfigOptions]   = useState<GenericOption[]>([]);
    const [disciplineOptions, setDisciplineOptions]   = useState<GenericOption[]>([]);

    const videoRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            setLoadingOptions(true);
            try {
                const [grammaticalRes, handConfigRes, disciplineRes] = await Promise.all([
                    GetRequest<GenericOption[]>(SIGNS.OPTIONS()),
                    GetRequest<HandConfigOption[]>(HAND_CONFIG.FIND_ALL()),
                    GetRequest<DisciplineOption[]>(DISCIPLINES.MINE()),
                ]);
                if (grammaticalRes.success) setGrammaticalOptions(grammaticalRes.object ?? []);
                if (handConfigRes.success) {
                    setHandConfigOptions(
                        (handConfigRes.object ?? []).map((hc) => ({ label: hc.name, value: hc.id }))
                    );
                }
                if (disciplineRes.success) {
                    setDisciplineOptions(
                        (disciplineRes.object ?? []).map((d) => ({ label: d.name, value: d.id }))
                    );
                }
            } finally {
                setLoadingOptions(false);
            }
        };
        load();
    }, []);

    const handleVideo = (file: File) => {
        if (!ACCEPTED_VIDEO.includes(file.type)) {
            toast.error("Formato inválido. Use MP4, WebM ou MOV.");
            return;
        }
        setVideoFile(file);
    };

    const handleImage = (file: File) => {
        if (!ACCEPTED_IMAGE.includes(file.type)) {
            toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveVideo = () => {
        setVideoFile(null);
        if (videoRef.current) videoRef.current.value = "";
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (imageRef.current) imageRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("grammaticalClass", grammaticalClass);
        formData.append("handConfigId", handConfigId);

        if (disciplineId) formData.append("disciplineId", disciplineId);
        if (videoFile) formData.append("video", videoFile);
        if (anotherUrl.trim()) formData.append("anotherUrl", anotherUrl.trim());
        if (imageFile) formData.append("image", imageFile);
        if (examplePt.trim()) formData.append("examplePt", examplePt.trim());
        if (exampleLibras.trim()) formData.append("exampleLibras", exampleLibras.trim());
        if (movementDesc.trim()) formData.append("movementDescription", movementDesc.trim());
        if (tags.length > 0) formData.append("tags", tags.join(","));

        setLoading(true);
        try {
            const response = await PostFormDataRequest(SIGNS.CREATE(), formData);
            if (!response.success) {
                toast.error(response.message);
                return;
            }
            toast.success("Sinal criado com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const isStep0Valid =
        name.trim().length >= 2 &&
        !!grammaticalClass &&
        !!handConfigId;

    const isStep1Valid = !!videoFile || !!anotherUrl.trim();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ProgressBar currentStep={view} totalSteps={2} />

            {/* Step 0: Informações do sinal */}
            {view === 0 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            Criar novo sinal
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Preencha as informações principais do sinal.
                        </p>
                    </div>

                    {/* Nome */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sign-name">Nome <span className="text-salmon-400">*</span></Label>
                        <Input
                            id="sign-name"
                            icon={SignLanguageCIcon}
                            placeholder="Ex: Bom dia"
                            value={name}
                            onChange={setName}
                            autoFocus
                        />
                    </div>

                    {/* Classe gramatical / Config de mão */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="grammatical-class">Classe gramatical <span className="text-salmon-400">*</span></Label>
                            <Select
                                id="grammatical-class"
                                icon={TextSelectIcon}
                                placeholder={loadingOptions ? "Carregando..." : "Selecione"}
                                options={grammaticalOptions}
                                value={grammaticalClass}
                                onChange={setGrammaticalClass}
                                disabled={loadingOptions}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="hand-config">Config. de mão <span className="text-salmon-400">*</span></Label>
                            <Select
                                id="hand-config"
                                icon={SignLanguageCIcon}
                                placeholder={loadingOptions ? "Carregando..." : "Selecione"}
                                options={handConfigOptions}
                                value={handConfigId}
                                onChange={setHandConfigId}
                                disabled={loadingOptions}
                            />
                        </div>
                    </div>

                    {/* Disciplina */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="discipline">
                            Disciplina <span className="text-cloud-300 font-normal">(opcional)</span>
                        </Label>
                        <Select
                            id="discipline"
                            icon={LayersIcon}
                            placeholder={loadingOptions ? "Carregando..." : "Selecione uma turma"}
                            options={disciplineOptions}
                            value={disciplineId}
                            onChange={setDisciplineId}
                            disabled={loadingOptions}
                        />
                    </div>

                    {/* Exemplos */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="example-pt">Exemplo em português</Label>
                            <Input
                                id="example-pt"
                                icon={MusicNote01Icon}
                                placeholder='Ex: "Bom dia, tudo bem?"'
                                value={examplePt}
                                onChange={setExamplePt}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="example-libras">Exemplo em Libras</Label>
                            <Input
                                id="example-libras"
                                icon={MusicNote01Icon}
                                placeholder="Ex: BOM-DIA TUDO BEM"
                                value={exampleLibras}
                                onChange={setExampleLibras}
                            />
                        </div>
                    </div>

                    {/* Movimento */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="movement-desc">Descrição do movimento</Label>
                        <Input
                            id="movement-desc"
                            icon={TextSelectIcon}
                            placeholder="Descreva o movimento das mãos..."
                            value={movementDesc}
                            onChange={setMovementDesc}
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tag-input">Tags / sinais relacionados</Label>
                        <CheckInput
                            id="tag-input"
                            icon={TagsIcon}
                            placeholder="Adicionar tag e pressionar Enter..."
                            tags={tags}
                            onChange={setTags}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-14 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
                        </button>
                        <Button
                            type="button"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isStep0Valid}
                            onClick={() => setView(1)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 1: Mídia */}
            {view === 1 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            Mídia do sinal
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Adicione o vídeo (ou um link) e uma imagem ilustrativa.
                        </p>
                    </div>

                    {/* Vídeo */}
                    <div className="flex flex-col gap-1.5">
                        <Label>
                            Vídeo <span className="text-salmon-400">*</span>
                            <span className="text-cloud-300 font-normal ml-1">(ou URL abaixo)</span>
                        </Label>

                        {videoFile ? (
                            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-cloud-200 bg-neutral-50">
                                <div className="flex items-center gap-2 min-w-0">
                                    <HugeiconsIcon icon={Video01Icon} size={18} className="text-campfire-500 shrink-0" />
                                    <span className="text-sm text-cloud-700 font-medium truncate">{videoFile.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveVideo}
                                    className="p-1.5 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50 shrink-0"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => videoRef.current?.click()}
                                className="w-full py-6 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 cursor-pointer
                                    flex flex-col items-center justify-center gap-2 transition-all
                                    hover:border-campfire-400 hover:bg-campfire-50"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-campfire-100">
                                    <HugeiconsIcon icon={Video01Icon} size={20} className="text-campfire-500" />
                                </span>
                                <p className="text-sm font-semibold text-cloud-700">Enviar vídeo (MP4, WebM, MOV)</p>
                            </div>
                        )}

                        <input
                            ref={videoRef}
                            type="file"
                            accept=".mp4,.webm,.mov,.ogg"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideo(f); }}
                        />
                    </div>

                    {/* URL alternativa */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="another-url">URL alternativa (YouTube, etc.)</Label>
                        <Input
                            id="another-url"
                            icon={LinkSquare02Icon}
                            placeholder="https://youtube.com/..."
                            value={anotherUrl}
                            onChange={setAnotherUrl}
                        />
                    </div>

                    {/* Imagem */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Imagem ilustrativa <span className="text-cloud-300 font-normal">(opcional)</span></Label>

                        {imagePreview ? (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-cloud-200 bg-neutral-50">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-1.5 cursor-pointer rounded-full duration-300 bg-cloud-100 text-cloud-500 hover:bg-cloud-300/50"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                                </button>
                                {imageFile && (
                                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                                        {imageFile.name}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => imageRef.current?.click()}
                                className="w-full py-6 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 cursor-pointer
                                    flex flex-col items-center justify-center gap-2 transition-all
                                    hover:border-sunflower-400 hover:bg-sunflower-100"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-campfire-100">
                                    <HugeiconsIcon icon={Image01Icon} size={20} className="text-campfire-500" />
                                </span>
                                <p className="text-sm font-semibold text-cloud-700">Enviar imagem (PNG ou JPG)</p>
                            </div>
                        )}

                        <input
                            ref={imageRef}
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => setView(0)}
                            className="w-14 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80"
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
                        </button>
                        <Button
                            type="submit"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isStep1Valid}
                            loading={loading}
                            loadingText="Criando sinal..."
                        >
                            Criar sinal
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};
