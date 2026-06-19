import { useFAB } from "@context/FABContext";

export const JoinClassroomCard = () => {
    const { openForm } = useFAB();

    return (
        <button
            onClick={() => openForm("join-class")}
            className="w-full group relative flex flex-col items-center justify-center gap-4 px-8 py-10 rounded-3xl border-2 border-dashed border-cloud-300 bg-cloud-50 transition-all duration-300 hover:border-sky-400 hover:bg-white focus:outline-none hover:-translate-y-1"
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-sky-100 transition-all duration-300 group-hover:bg-sky-200">
                <img src="src/assets/images/app/join-class.png" alt="" className="w-10 h-10" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-lg font-semibold text-cloud-700">
                    Entrar em uma turma
                </h3>
                <p className="text-sm text-cloud-400 group-hover:text-cloud-500 transition-colors duration-300">
                    Use o código de convite
                </p>
            </div>
        </button>
    );
};
