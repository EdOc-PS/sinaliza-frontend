import interpreterImg from "@/assets/images/interpreter.png";
import studentImg from "@/assets/images/student.png";
import educatorImg from "@/assets/images/educator.png";

import WordReveal from "./WordReveal";

const audiences = [
    {
        title: "Intérprete",
        description: "Cadastra sinais, sobe vídeos e descrições e cuida da qualidade do conteúdo em Libras.",
        image: interpreterImg,
        dot: "bg-lime-500",
    },
    {
        title: "Aluno",
        description: "Assiste aos sinais da turma, favorita os que mais usa e aprende no próprio ritmo.",
        image: studentImg,
        dot: "bg-sky-500",
    },
    {
        title: "Professor",
        description: "Cria turmas, valida o conteúdo e acompanha o que os alunos estão estudando.",
        image: educatorImg,
        dot: "bg-campfire-500",
    },
];

// "Para quem é" — três colunas separadas por linhas finas, sem cards
export const LandingAudience = () => (
    <section id="para-quem" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="reveal max-w-2xl font-baskerville text-3xl font-semibold leading-tight tracking-tight text-cloud-600 sm:text-5xl">
                <WordReveal lines={[["Cada", "papel", "da", "sala"], ["tem", "seu", "lugar."]]} />
            </h2>

            <div className="mt-16 grid grid-cols-1 border-t border-cloud-200 md:grid-cols-3">
                {audiences.map((item, i) => (
                    <div
                        key={item.title}
                        className={`reveal flex flex-col gap-5 py-10 md:px-8 md:py-12 ${i > 0 ? "border-t border-cloud-200 md:border-l md:border-t-0" : "md:pl-0"}`}
                        style={{ transitionDelay: `${i * 90}ms` }}
                    >
                        <img src={item.image} alt="" className="h-16 w-16 object-contain" />
                        <h3 className="flex items-center gap-2.5 font-baskerville font-semibold text-2xl text-cloud-600">
                            <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                            {item.title}
                        </h3>
                        <p className="max-w-xs text-sm sm:text-base leading-relaxed text-cloud-500/75">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingAudience;
