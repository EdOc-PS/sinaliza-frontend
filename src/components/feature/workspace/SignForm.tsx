import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import InputText from "@components/ui/InputText";
import InputImage from "@components/ui/InputImage";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import ProgressBar from "@components/layout/ProgressBar";
import InputCheck from "@/components/ui/InputCheck";

import {
    ArrowLeft01Icon,
    Cancel01Icon,
    LayersIcon,
    LinkSquare02Icon,
    RotateRight01Icon,
    SignLanguageCIcon,
    SpeechIcon,
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

    const [name, setName]                         = useState("");
    const [grammaticalClass, setGrammaticalClass] = useState("");
    const [disciplineId, setDisciplineId]         = useState("");
    const [handConfigId, setHandConfigId]         = useState("");
    const [tags, setTags]                         = useState<string[]>([]);
    const [examplePt, setExamplePt]               = useState("");
    const [exampleLibras, setExampleLibras]       = useState("");
    const [movementDesc, setMovementDesc]         = useState("");
    const [anotherUrl, setAnotherUrl]             = useState("");
    const [videoFile, setVideoFile]               = useState<File | null>(null);
    const [imageFile, setImageFile]               = useState<File | null>(null);

    const [loading, setLoading]                       = useState(false);
    const [loadingOptions, setLoadingOptions]         = useState(false);
    const [grammaticalOptions, setGrammaticalOptions] = useState<GenericOption[]>([]);
    const [handConfigOptions, setHandConfigOptions]   = useState<GenericOption[]>([]);
    const [disciplineOptions, setDisciplineOptions]   = useState<GenericOption[]>([]);

    const videoRef = useRef<HTMLInputElement>(null);

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

    const handleRemoveVideo = () => {
        setVideoFile(null);
        if (videoRef.current) videoRef.current.value = "";
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

    const nameValid = name.trim().length >= 3;

    const isStep0Valid =
        nameValid &&
        !!grammaticalClass &&
        !!disciplineId &&
        !!handConfigId;

    const isStep2Valid = !!videoFile || !!anotherUrl.trim();

    const BackBtn = ({ onClick }: { onClick: () => void }) => (
        <button
            type="button"
            onClick={onClick}
            className="w-16 flex justify-center cursor-pointer items-center p-2 rounded-3xl bg-cloud-300/80 hover:bg-cloud-400/60 transition-colors duration-200"
        >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={26} />
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ProgressBar currentStep={view} totalSteps={3} />

            {/* Step 0: Informações principais */}
            {view === 0 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Criar novo sinal</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Preencha as informações principais do sinal.</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sign-name">Nome</Label>
                        <Input
                            id="sign-name"
                            icon={SignLanguageCIcon}
                            placeholder="Ex: Bom dia"
                            value={name}
                            onChange={setName}
                            autoFocus
                        />
                        {name.trim() !== "" && !nameValid ? (
                            <p className="text-xs text-neutral-400 pl-1">
                                O nome precisa ter pelo menos 3 caracteres.
                            </p>
                        ) : (
                            <p className="text-xs text-cloud-400 pl-1">
                                Use um nome claro que ajude educadores e alunos a identificar.
                            </p>
                        )}
                    </div>

                    {/* Classe gramatical / Disciplina */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="grammatical-class">Classe gramatical</Label>
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
                            <Label htmlFor="discipline">Disciplina</Label>
                            <Select
                                id="discipline"
                                icon={LayersIcon}
                                placeholder={loadingOptions ? "Carregando..." : "Selecione"}
                                options={disciplineOptions}
                                value={disciplineId}
                                onChange={setDisciplineId}
                                disabled={loadingOptions}
                            />
                        </div>
                    </div>

                    {/* Config. de mão */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="hand-config">Config. de mão</Label>
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

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tag-input" isOptional>Tags / sinais relacionados</Label>
                        <InputCheck
                            id="tag-input"
                            icon={TagsIcon}
                            placeholder="Adicionar tag e pressionar Enter..."
                            tags={tags}
                            onChange={setTags}
                        />
                    </div>

                    <div className="flex gap-3 pt-1 justify-end">
                        <Button type="button" variant="outline" className="w-2/5" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="cloud"
                            className="w-3/5"
                            disabled={!isStep0Valid}
                            onClick={() => setView(1)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 1: Contexto */}
            {view === 1 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Contexto do sinal</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Adicione exemplos e descreva o movimento das mãos.</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="example-pt" isOptional>Exemplo em português</Label>
                        <Input
                            id="example-pt"
                            icon={SpeechIcon}
                            placeholder='Ex: "Bom dia, tudo bem?"'
                            value={examplePt}
                            onChange={setExamplePt}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="example-libras" isOptional>Exemplo em Libras</Label>
                        <Input
                            id="example-libras"
                            icon={RotateRight01Icon}
                            placeholder="Ex: BOM-DIA TUDO BEM"
                            value={exampleLibras}
                            onChange={setExampleLibras}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="movement-desc" isOptional>Descrição do movimento</Label>
                        <InputText
                            id="movement-desc"
                            icon={TextSelectIcon}
                            placeholder="Descreva o movimento das mãos..."
                            value={movementDesc}
                            onChange={setMovementDesc}
                            height={96}
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <BackBtn onClick={() => setView(0)} />
                        <Button
                            type="button"
                            variant="cloud"
                            className="flex-1"
                            onClick={() => setView(2)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 2: Mídia */}
            {view === 2 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Mídia do sinal</h2>
                        <p className="text-sm text-cloud-400 leading-snug">Adicione o vídeo (ou um link) e uma imagem ilustrativa.</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Vídeo</Label>

                        {videoFile ? (
                            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-cloud-200 bg-neutral-50">
                                <div className="flex items-center gap-2 min-w-0">
                                    <HugeiconsIcon icon={Video01Icon} size={18} className="text-salmon-500 shrink-0" />
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
                                className="w-full py-8 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 cursor-pointer
                                    flex flex-col items-center justify-center gap-2 transition-all
                                    hover:border-salmon-400 hover:bg-salmon-50"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-salmon-100">
                                    <HugeiconsIcon icon={Video01Icon} size={20} className="text-salmon-500" />
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

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="another-url" isOptional>URL alternativa (YouTube, etc.)</Label>
                        <Input
                            id="another-url"
                            icon={LinkSquare02Icon}
                            placeholder="https://youtube.com/..."
                            value={anotherUrl}
                            onChange={setAnotherUrl}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label isOptional>Imagem ilustrativa</Label>
                        <InputImage
                            description="Imagem de referência para o sinal · PNG ou JPG"
                            onChange={setImageFile}
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <BackBtn onClick={() => setView(1)} />
                        <Button
                            type="submit"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isStep2Valid}
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
