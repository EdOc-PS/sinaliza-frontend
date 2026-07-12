import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@components/ui/Button";
import Spinner from "@components/ui/Spinner";
import Input from "@components/ui/Input";
import InputText from "@components/ui/InputText";
import InputImage from "@components/ui/InputImage";
import InputVideo from "@components/ui/InputVideo";
import HandConfigPicker from "@components/feature/workspace/HandConfigPicker";
import Label from "@components/ui/Label";
import Select from "@components/ui/Select";
import MultiSelect from "@components/ui/MultiSelect";
import ProgressBar from "@components/layout/ProgressBar";
import InputCheck from "@/components/ui/InputCheck";
import BackButton from "@components/ui/BackButton";

import {
    LayersIcon,
    LinkSquare02Icon,
    RotateRight01Icon,
    SignLanguageCIcon,
    SpeechIcon,
    TagsIcon,
    TextSelectIcon,
} from "@hugeicons/core-free-icons";

import type { GenericOption } from "@interfaces";
import { SIGNS } from "@routes/signs";
import { GetRequest, PatchFormDataRequest, PostFormDataRequest } from "@requests";
import { isValidYouTubeUrl } from "@lib/youtube/youtube";

interface SignOptions {
    categories: GenericOption[];
    disciplines: GenericOption[];
}

interface SignFormProps {
    signId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface SignDetail {
    id: string;
    name: string;
    category?: { id: string; name: string; value: string } | null;
    handConfigId: string;
    disciplines?: { id: string; name: string }[] | null;
    tags: string[];
    examplePt?: string | null;
    exampleLibras?: string | null;
    movementDescription?: string | null;
    videoUrl?: string | null;
    anotherUrl?: string | null;
    imgUrl?: string | null;
}

export const SignForm = ({ signId, onClose, onSuccess }: SignFormProps) => {
    const isEditMode = !!signId;
    const [view, setView] = useState(0);

    const [name, setName]                         = useState("");
    const [categoryId, setCategoryId]             = useState("");
    const [disciplineIds, setDisciplineIds]       = useState<string[]>([]);
    const [handConfigId, setHandConfigId]         = useState("");
    const [tags, setTags]                         = useState<string[]>([]);
    const [examplePt, setExamplePt]               = useState("");
    const [exampleLibras, setExampleLibras]       = useState("");
    const [movementDesc, setMovementDesc]         = useState("");
    const [anotherUrl, setAnotherUrl]             = useState("");
    const [videoFile, setVideoFile]               = useState<File | null>(null);
    const [imageFile, setImageFile]               = useState<File | null>(null);
    const [initialVideoUrl, setInitialVideoUrl]   = useState<string | undefined>();
    const [initialImageUrl, setInitialImageUrl]   = useState<string | undefined>();

    const [loading, setLoading]                       = useState(false);
    const [loadingData, setLoadingData]               = useState(false);
    const [loadingOptions, setLoadingOptions]         = useState(false);
    const [categoryOptions, setCategoryOptions]       = useState<GenericOption[]>([]);
    const [disciplineOptions, setDisciplineOptions]   = useState<GenericOption[]>([]);

    const loadAll = async () => {
        setLoadingOptions(true);
        if (signId) setLoadingData(true);
        try {
            const requests: Promise<any>[] = [
                GetRequest<SignOptions>(SIGNS.OPTIONS()),
            ];
            if (signId) requests.push(GetRequest<SignDetail>(SIGNS.FIND_ONE(signId)));

            const [optionsRes, signRes] = await Promise.all(requests);

            if (optionsRes.success && optionsRes.object) {
                setCategoryOptions(optionsRes.object.categories ?? []);
                setDisciplineOptions(optionsRes.object.disciplines ?? []);
            }

            if (signRes) {
                if (!signRes.success || !signRes.object) {
                    toast.error("Falha ao carregar sinal: " + signRes.message);
                    onClose();
                    return;
                }
                const s: SignDetail = signRes.object;
                setName(s.name);
                setCategoryId(s.category?.id ?? "");
                setHandConfigId(s.handConfigId);
                setDisciplineIds((s.disciplines ?? []).map((d) => d.id));
                setTags(s.tags ?? []);
                setExamplePt(s.examplePt ?? "");
                setExampleLibras(s.exampleLibras ?? "");
                setMovementDesc(s.movementDescription ?? "");
                setAnotherUrl(s.anotherUrl ?? "");
                setInitialVideoUrl(s.videoUrl ?? undefined);
                setInitialImageUrl(s.imgUrl ?? undefined);
            }
        } finally {
            setLoadingOptions(false);
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("categoryId", categoryId);
        formData.append("handConfigId", handConfigId);

        // Disciplinas (m2m). Em edição, sempre envia (mesmo vazio) para permitir remover todas.
        if (disciplineIds.length > 0) {
            formData.append("disciplineIds", disciplineIds.join(","));
        } else if (isEditMode) {
            formData.append("disciplineIds", "");
        }
        if (videoFile) formData.append("video", videoFile);
        if (anotherUrl.trim()) formData.append("anotherUrl", anotherUrl.trim());
        if (imageFile) formData.append("image", imageFile);
        if (examplePt.trim()) formData.append("examplePt", examplePt.trim());
        if (exampleLibras.trim()) formData.append("exampleLibras", exampleLibras.trim());
        if (movementDesc.trim()) formData.append("movementDescription", movementDesc.trim());
        if (tags.length > 0) formData.append("tags", tags.join(","));

        setLoading(true);
        try {
            const response = isEditMode
                ? await PatchFormDataRequest(SIGNS.UPDATE(signId!), formData)
                : await PostFormDataRequest(SIGNS.CREATE(), formData);

            if (!response.success) {
                toast.error(response.message);
                return;
            }
            toast.success(isEditMode ? "Sinal atualizado com sucesso!" : "Sinal criado com sucesso!");
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const nameValid = name.trim().length >= 3;

    // Step 0: informações principais (sem tags)
    const isStep0Valid =
        nameValid &&
        !!categoryId &&
        disciplineIds.length > 0 &&
        !!handConfigId;

    // Step 2: tags (obrigatório pelo menos uma)
    const isTagsValid = tags.length > 0;

    // Step 4: mídia — vídeo OU url do YouTube (bloqueio mútuo entre os dois)
    const urlFilled = anotherUrl.trim() !== "";
    const urlIsYouTube = urlFilled && isValidYouTubeUrl(anotherUrl);
    const videoDisabled = urlFilled;
    const urlDisabled = !!videoFile;

    const hasMedia = !!videoFile || !!initialVideoUrl || urlFilled;
    // URL preenchida precisa ser um link válido do YouTube
    const isMediaValid = hasMedia && (!urlFilled || urlIsYouTube);

    // Em edição: permite salvar de qualquer step, desde que tudo esteja válido
    const isFormValid = isStep0Valid && isTagsValid && isMediaValid;

    // Botão de salvar direto (só na edição, exceto no último step que já tem o submit final)
    const editSaveButton = isEditMode && view !== 4 && (
        <Button
            type="submit"
            variant="outline"
            className="flex-1"
            disabled={!isFormValid}
            loading={loading}
            loadingText="Salvando..."
        >
            Salvar alterações
        </Button>
    );

    useEffect(() => {
        loadAll();
    }, [signId]);

    if (loadingData) {
        return (
            <div className="flex items-center justify-center py-16">
                <Spinner size={32} />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ProgressBar
                currentStep={view}
                totalSteps={5}
                onStepClick={isEditMode ? setView : undefined}
            />

            {/* Step 0: Informações principais */}
            {view === 0 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">
                            {isEditMode ? "Editar sinal" : "Criar novo sinal"}
                        </h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            {isEditMode ? "Atualize as informações do sinal." : "Preencha as informações principais do sinal."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sign-name" isRequired>Nome</Label>
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

                    {/* Categoria */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="category" isRequired>Categoria</Label>
                        <Select
                            id="category"
                            icon={TextSelectIcon}
                            placeholder={loadingOptions ? "Carregando..." : "Selecione"}
                            options={categoryOptions}
                            value={categoryId}
                            onChange={setCategoryId}
                            disabled={loadingOptions}
                        />
                    </div>

                    {/* Disciplinas (múltiplas) — ocupa a linha inteira */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="disciplines" isRequired>Disciplinas</Label>
                        <MultiSelect
                            id="disciplines"
                            icon={LayersIcon}
                            placeholder={loadingOptions ? "Carregando..." : "Selecione uma ou mais disciplinas"}
                            options={disciplineOptions}
                            value={disciplineIds}
                            onChange={setDisciplineIds}
                            disabled={loadingOptions}
                        />
                    </div>

                    {/* Config. de mão (teclado visual) */}
                    <div className="flex flex-col gap-1.5">
                        <Label isRequired>Config. de mão</Label>
                        <HandConfigPicker value={handConfigId} onChange={setHandConfigId} />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancelar
                        </Button>
                        {editSaveButton}
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
                        <BackButton onClick={() => setView(0)} />
                        {editSaveButton}
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

            {/* Step 2: Tags */}
            {view === 2 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Tags do sinal</h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Adicione palavras-chave e sinais relacionados. Elas ajudam alunos e educadores a
                            encontrar este sinal na busca e a conectá-lo a temas parecidos.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tag-input" isRequired>Tags / sinais relacionados</Label>
                        <InputCheck
                            id="tag-input"
                            icon={TagsIcon}
                            placeholder="Adicionar tag e pressionar Enter..."
                            tags={tags}
                            onChange={setTags}
                        />
                        <p className="text-xs text-cloud-400 pl-1">
                            Ex: saudação, cumprimento, cotidiano. Digite e pressione Enter para cada tag.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <BackButton onClick={() => setView(1)} />
                        {editSaveButton}
                        <Button
                            type="button"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isTagsValid}
                            onClick={() => setView(3)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 3: Imagem (penúltimo) */}
            {view === 3 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Imagem ilustrativa</h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Envie uma imagem de referência do sinal (opcional). Ela aparece como capa e ajuda
                            na identificação rápida antes de assistir ao vídeo.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label isOptional>Imagem ilustrativa</Label>
                        <InputImage
                            initialPreview={initialImageUrl}
                            description="Imagem de referência para o sinal · PNG ou JPG"
                            onChange={setImageFile}
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <BackButton onClick={() => setView(2)} />
                        {editSaveButton}
                        <Button
                            type="button"
                            variant="cloud"
                            className="flex-1"
                            onClick={() => setView(4)}
                        >
                            Próximo
                        </Button>
                    </div>
                </>
            )}

            {/* Step 4: Vídeo ou URL (último) */}
            {view === 4 && (
                <>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-medium text-cloud-700 font-baskerville">Vídeo do sinal</h2>
                        <p className="text-sm text-cloud-400 leading-snug">
                            Envie um <b>vídeo</b> do sinal <b>ou</b> informe um <b>link</b> (YouTube, etc.).
                            É obrigatório escolher uma das opções — ao preencher uma, a outra fica bloqueada.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label isRequired={!urlDisabled} isOptional={urlDisabled}>Enviar vídeo</Label>
                        <InputVideo
                            initialPreview={initialVideoUrl}
                            disabled={videoDisabled}
                            onChange={setVideoFile}
                        />
                        {videoDisabled && (
                            <p className="text-xs text-neutral-400 pl-1">
                                Bloqueado porque você informou uma URL. Limpe a URL para enviar um vídeo.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="h-px flex-1 bg-cloud-200" />
                        <span className="text-xs font-medium text-cloud-400">ou</span>
                        <span className="h-px flex-1 bg-cloud-200" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="another-url" isRequired={!urlDisabled} isOptional={urlDisabled}>
                            URL do YouTube
                        </Label>
                        <Input
                            id="another-url"
                            icon={LinkSquare02Icon}
                            placeholder="https://youtube.com/watch?v=..."
                            value={anotherUrl}
                            onChange={setAnotherUrl}
                            disabled={urlDisabled}
                            wrapperClassName={urlDisabled ? "opacity-50" : ""}
                        />
                        {urlDisabled ? (
                            <p className="text-xs text-neutral-400 pl-1">
                                Bloqueado porque você enviou um vídeo. Remova o vídeo para usar uma URL.
                            </p>
                        ) : urlFilled && !urlIsYouTube ? (
                            <p className="text-xs text-salmon-500 pl-1">
                                Informe um link válido do YouTube (youtube.com/watch, youtu.be, shorts ou embed).
                            </p>
                        ) : (
                            <p className="text-xs text-cloud-400 pl-1">
                                Apenas links do YouTube são aceitos.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <BackButton onClick={() => setView(3)} />
                        <Button
                            type="submit"
                            variant="cloud"
                            className="flex-1"
                            disabled={!isMediaValid}
                            loading={loading}
                            loadingText={isEditMode ? "Salvando..." : "Criando sinal..."}
                        >
                            {isEditMode ? "Salvar alterações" : "Criar sinal"}
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};
