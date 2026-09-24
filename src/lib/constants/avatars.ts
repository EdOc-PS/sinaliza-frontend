import alien from "@/assets/images/avatares/alien.png";
import astronaut from "@/assets/images/avatares/astronaut.png";
import girlHeart from "@/assets/images/avatares/girl-heart.png";
import girl from "@/assets/images/avatares/girl.png";
import kitten from "@/assets/images/avatares/kitten.png";
import knight from "@/assets/images/avatares/knight.png";
import ninja from "@/assets/images/avatares/ninja.png";
import paleontologist from "@/assets/images/avatares/paleontologist.png";
import pirate from "@/assets/images/avatares/pirate.png";
import police from "@/assets/images/avatares/police.png";
import psychologist from "@/assets/images/avatares/psychologist.png";
import queen from "@/assets/images/avatares/queen.png";
import robot from "@/assets/images/avatares/robot.png";
import student from "@/assets/images/avatares/student.png";
import superhero from "@/assets/images/avatares/superhero.png";
import teacherBlond from "@/assets/images/avatares/teacher-blond.png";
import teacher from "@/assets/images/avatares/teacher.png";
import vampire from "@/assets/images/avatares/vampire.png";
import veterinary from "@/assets/images/avatares/veterinary.png";
import witch from "@/assets/images/avatares/witch.png";
import wizard from "@/assets/images/avatares/wizard.png";

// Avatares pré-definidos: o banco guarda só a chave (ex: "robot"), nunca a
// imagem — o caminho já existe empacotado no front, sem gastar espaço no Neon.
export const AVATAR_PRESETS: Record<string, string> = {
    alien,
    astronaut,
    "girl-heart": girlHeart,
    girl,
    kitten,
    knight,
    ninja,
    paleontologist,
    pirate,
    police,
    psychologist,
    queen,
    robot,
    student,
    superhero,
    "teacher-blond": teacherBlond,
    teacher,
    vampire,
    veterinary,
    witch,
    wizard,
};

export const AVATAR_PRESET_KEYS = Object.keys(AVATAR_PRESETS);

export const getRandomAvatarKey = (): string =>
    AVATAR_PRESET_KEYS[Math.floor(Math.random() * AVATAR_PRESET_KEYS.length)];

// Resolve a chave salva no usuário para a imagem correspondente — chave
// desconhecida ou ausente cai no fallback de iniciais de quem chamar.
export function getAvatarUrl(avatar?: string | null): string | undefined {
    if (!avatar) return undefined;
    return AVATAR_PRESETS[avatar];
}
