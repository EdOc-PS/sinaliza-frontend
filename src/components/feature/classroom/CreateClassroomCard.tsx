interface CreateClassroomCardProps {
    onClick?: () => void;
}

export const CreateClassroomCard = ({ onClick }: CreateClassroomCardProps) => (
    <button
        onClick={onClick}
        className="w-full group relative flex flex-col items-center justify-center gap-4 px-8 py-10 rounded-3xl border-2 border-dashed border-cloud-300 bg-cloud-50 transition-all duration-300 hover:border-sunflower-400 hover:bg-white focus:outline-none hover:-translate-y-1 "
    >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-100 transition-all duration-300">
            <img src="src/assets/app/create-class.png" alt="" className="w-10 h-10" />
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-cloud-700 transition-colors duration-300">
                Criar nova turma
            </h3>
            <p className="text-sm text-cloud-400 transition-colors duration-300 group-hover:text-cloud-500">
                Configure nome e código
            </p>
        </div>
    </button>
);