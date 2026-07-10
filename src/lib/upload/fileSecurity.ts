// Validação de upload no cliente — camada de UX + primeira barreira.
// IMPORTANTE: isto NÃO substitui a validação do backend (o front sempre pode ser burlado).

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; //  5 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export type UploadKind = "image" | "video";

const ACCEPT: Record<UploadKind, { mimes: string[]; exts: string[]; label: string; maxBytes: number }> = {
    image: {
        mimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
        exts: ["png", "jpg", "jpeg", "webp"],
        label: "imagem",
        maxBytes: MAX_IMAGE_BYTES,
    },
    video: {
        mimes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
        exts: ["mp4", "webm", "ogg", "mov"],
        label: "vídeo",
        maxBytes: MAX_VIDEO_BYTES,
    },
};

// ─────────────────────────────────────────────
// Magic bytes — confere o conteúdo real do arquivo
// ─────────────────────────────────────────────

type Signature = { offset: number; bytes: number[] };

const ascii = (t: string): number[] => [...t].map((c) => c.charCodeAt(0));

const SIGNATURES: Record<UploadKind, Signature[]> = {
    image: [
        { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }, // PNG
        { offset: 0, bytes: [0xff, 0xd8, 0xff] }, // JPEG
        { offset: 0, bytes: ascii("RIFF") }, // WEBP (checa "WEBP" no offset 8 à parte)
    ],
    video: [
        { offset: 4, bytes: ascii("ftyp") }, // MP4 / MOV
        { offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] }, // WEBM / Matroska
        { offset: 0, bytes: ascii("OggS") }, // OGG
    ],
};

function matches(bytes: Uint8Array, sig: Signature): boolean {
    if (bytes.length < sig.offset + sig.bytes.length) return false;
    return sig.bytes.every((b, i) => bytes[sig.offset + i] === b);
}

async function readHeader(file: File, length = 16): Promise<Uint8Array> {
    const buffer = await file.slice(0, length).arrayBuffer();
    return new Uint8Array(buffer);
}

function hasValidMagic(bytes: Uint8Array, kind: UploadKind): boolean {
    const matched = SIGNATURES[kind].some((sig) => matches(bytes, sig));
    if (!matched) return false;
    // WEBP: "RIFF" no início + "WEBP" no offset 8 (RIFF sozinho é ambíguo)
    if (kind === "image" && matches(bytes, { offset: 0, bytes: ascii("RIFF") })) {
        return matches(bytes, { offset: 8, bytes: ascii("WEBP") });
    }
    return true;
}

// ─────────────────────────────────────────────
// Sanitização de nome
// ─────────────────────────────────────────────

export function sanitizeFileName(originalName: string): string {
    const name = originalName.split(/[\\/]/).pop() ?? "file";
    const dot = name.lastIndexOf(".");
    const base =
        (dot > 0 ? name.slice(0, dot) : name)
            .normalize("NFKD")
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 80) || "file";
    const ext = (dot > 0 ? name.slice(dot + 1) : "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 10);
    return ext ? `${base}.${ext}` : base;
}

function getExtension(name: string): string {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

// ─────────────────────────────────────────────
// Validação principal
// ─────────────────────────────────────────────

export interface ValidationResult {
    ok: boolean;
    error?: string;
    /** Arquivo com nome saneado, pronto para envio (só quando ok) */
    file?: File;
}

export async function validateUpload(file: File, kind: UploadKind): Promise<ValidationResult> {
    const cfg = ACCEPT[kind];

    if (file.size === 0) {
        return { ok: false, error: `Arquivo de ${cfg.label} vazio.` };
    }

    if (file.size > cfg.maxBytes) {
        const mb = Math.round(cfg.maxBytes / (1024 * 1024));
        return { ok: false, error: `O ${cfg.label} excede o limite de ${mb}MB.` };
    }

    if (!cfg.mimes.includes(file.type)) {
        return { ok: false, error: `Tipo de ${cfg.label} não permitido.` };
    }

    if (!cfg.exts.includes(getExtension(file.name))) {
        return { ok: false, error: `Extensão de ${cfg.label} não permitida.` };
    }

    const header = await readHeader(file);
    if (!hasValidMagic(header, kind)) {
        return {
            ok: false,
            error: `Este arquivo não parece ser um ${cfg.label} válido (conteúdo não corresponde à extensão).`,
        };
    }

    // Reempacota com nome saneado
    const safeName = sanitizeFileName(file.name);
    const safeFile = safeName === file.name ? file : new File([file], safeName, { type: file.type });

    return { ok: true, file: safeFile };
}
