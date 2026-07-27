import interpreterImg from "@/assets/images/interpreter.png";
import studentImg from "@/assets/images/student.png";
import educatorImg from "@/assets/images/educator.png";
import guardianImg from "@/assets/images/guardian.png";

interface Audience {
    tag: string;
    title: string;
    description: string;
    image: string;
    cardClass: string;
}

const audiences: Audience[] = [
    {
        tag: "Criador de conteúdo",
        title: "Intérprete",
        description: "Cadastra sinais, sobe vídeos e descrições, organiza o repositório e garante a qualidade do conteúdo em Libras.",
        image: interpreterImg,
        cardClass: "bg-lime-100",
    },
    {
        tag: "Aprendiz",
        title: "Aluno",
        description: "Acessa o repositório de sinais, assiste aos vídeos, favorita os que mais usa e aprende no próprio ritmo.",
        image: studentImg,
        cardClass: "bg-sky-100",
    },
    {
        tag: "Gestor do conteúdo",
        title: "Professor",
        description: "Gerencia turmas, cadastra sinais na disciplina, valida conteúdos e acompanha o percurso de aprendizado.",
        image: educatorImg,
        cardClass: "bg-campfire-100",
    },
    {
        tag: "Apoio",
        title: "Familiar",
        description: "Acompanha a evolução do aluno, acessa os sinais das disciplinas e participa do processo de inclusão.",
        image: guardianImg,
        cardClass: "bg-salmon-100",
    },
];

// "Para quem é" — os 4 perfis da plataforma.
// O `.reveal` fica no wrapper: se o delay do stagger ficasse no mesmo elemento do
// hover, ele atrasaria a transição do hover e o movimento pareceria travado.
export const LandingAudience = () => (
    <section id="para-quem" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Cabeçalho */}
            <div className="reveal mx-auto max-w-2xl text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Para quem é</span>
                <h2 className="mt-3 font-baskerville text-3xl font-bold leading-tight text-cloud-500 sm:text-4xl">
                    Uma plataforma para
                    <br />
                    cada papel na educação
                </h2>
                <p className="mt-4 text-base text-cloud-400">
                    Do intérprete que cria ao familiar que apoia — o Sinaliza conecta todos os
                    envolvidos no aprendizado de Libras.
                </p>
            </div>

            {/* Cards */}
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {audiences.map((item, i) => (
                    <div key={item.title} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                        <div
                            className={`flex h-full flex-col gap-4 rounded-3xl p-6 transition-transform duration-300 ease-out hover:-translate-y-1.5 ${item.cardClass}`}
                        >
                            <img src={item.image} alt="" className="h-14 w-14 shrink-0 object-contain" />

                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-cloud-400">
                                    {item.tag}
                                </span>
                                <h3 className="font-baskerville text-xl font-bold text-cloud-600">{item.title}</h3>
                            </div>

                            <p className="text-sm leading-relaxed text-cloud-500/80">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingAudience;
