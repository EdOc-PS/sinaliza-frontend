import profile from "@/assets/images/profile.png";
import interpreter from "@/assets/images/interpreter.png";
import student from "@/assets/images/student.png";
import educator from "@/assets/images/educator.png";
import hello from "@/assets/images/hello.png";
import sun from "@/assets/images/sun.png";

// Avatares pré-definidos: o banco guarda só a chave (ex: "sun"), nunca a
// imagem — o caminho já existe empacotado no front, sem gastar espaço no Neon.
export const AVATAR_PRESETS: Record<string, string> = {
    profile,
    interpreter,
    student,
    educator,
    hello,
    sun,
};

export const AVATAR_PRESET_KEYS = Object.keys(AVATAR_PRESETS);

// Resolve a chave salva no usuário para a imagem correspondente — chave
// desconhecida ou ausente cai no fallback de iniciais de quem chamar.
export function getAvatarUrl(avatar?: string | null): string | undefined {
    if (!avatar) return undefined;
    return AVATAR_PRESETS[avatar];
}
