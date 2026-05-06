import { Key02Icon, MoreVerticalIcon, CopyIcon, DeleteIcon, UserGroupIcon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@components/ui/DropdownMenu";

import { toast } from "sonner";

import type { CardsDicipline } from "@pages/classrooms";

export interface DisciplineCardProps {
    dicipline: CardsDicipline;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const DisciplineCard = ({
    dicipline,
    onEdit,
    onDelete
}: DisciplineCardProps) => {
    
    const onCopyCode = () => {
        navigator.clipboard.writeText(dicipline.classCode)
            .then(() => {
                toast.success("Código copiado para a área de transferência!");
            })
    }

    return (
        <>
            <div className="relative rounded-3xl overflow-hidden transition-all duration-300 border border-cloud-300 h-55 hover:border-sunflower-400 focus:outline-none hover:-translate-y-1">
                {/* Header com cor e menu */}
                <div className="flex justify-end items-start px-4 h-2/5 py-3" style={{ backgroundColor: dicipline.colorBackground }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-xl hover:bg-white/20 transition-colors focus:outline-none">
                                <HugeiconsIcon icon={MoreVerticalIcon} size={20} className="text-white opacity-70" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem
                                icon={<HugeiconsIcon icon={Edit02Icon} size={18} />}
                                onSelect={() => onEdit?.()}
                            >
                                Editar turma
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                icon={<HugeiconsIcon icon={CopyIcon} size={18} />}
                                onSelect={onCopyCode}
                            >
                                Copiar código
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                variant="danger"
                                icon={<HugeiconsIcon icon={DeleteIcon} size={18} />}
                                onSelect={onDelete}
                            >
                                Excluir turma
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Conteúdo */}
                <div className="px-5 py-4 flex flex-col justify-between h-3/5 bg-white">
                    {/* Título e descrição */}
                    <div>
                        <h3 className="text-lg font-bold text-cloud-500">
                            {dicipline.name}
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Prof. {dicipline.teacherName} — {dicipline.schoolYear && `${dicipline.schoolYear}`}
                            {dicipline.schoolLevel && ` · ${dicipline.schoolLevel}`}
                        </p>
                    </div>

                    {/* Footer com código e contagem */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 border-dashed">
                        {/* Código de convite */}
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-100/80 p-1 px-2 rounded-xl">
                            <HugeiconsIcon icon={Key02Icon} size={16} />
                            <span className="text-xs font-mono font-semibold">{dicipline.classCode}</span>
                        </div>

                        {/* Contagem de usuários */}
                        <div className="flex items-center gap-1.5 text-gray-700">
                            <HugeiconsIcon icon={UserGroupIcon} size={16} />
                            <span className="text-sm font-semibold">{dicipline.userCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
