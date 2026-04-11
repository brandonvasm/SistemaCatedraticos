import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

const comments = [
  {
    course: "Cálculo I",
    text: "Excelente profesor, explica muy bien los conceptos difíciles y siempre está dispuesto a ayudar.",
    likes: 23,
    rating: 5,
    date: "2026-01-28",
    sentiment: "good",
  },
  {
    course: "Análisis Numérico",
    text: "Su metodología es muy efectiva, los ejemplos ayudan mucho.",
    likes: 18,
    rating: 5,
    date: "2026-01-25",
    sentiment: "good",
  },
  {
    course: "Cálculo II",
    text: "A veces va muy rápido y cuesta seguirle el ritmo.",
    likes: 5,
    rating: 3,
    date: "2026-01-20",
    sentiment: "bad",
  },
];

export default function CommentsSection() {

  const total = comments.length;
  const good = comments.filter(c => c.sentiment === "good").length;
  const bad = comments.filter(c => c.sentiment === "bad").length;

  const goodPercent = Math.round((good / total) * 100);
  const badPercent = Math.round((bad / total) * 100);

  return (
    <div
      className="
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
            COMENTARIOS DE ESTUDIANTES
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            {comments.length} COMENTARIOS REGISTRADOS
          </p>
        </div>

        <button
          className="
            bg-white/5
            hover:bg-white/10
            border border-white/10
            px-6 py-3
            rounded-2xl
            text-[11px]
            font-black
            uppercase
            tracking-widest
            text-gray-400
            hover:text-white
            transition-all
            active:scale-95
          "
        >
          Filtrar por Curso
        </button>
      </div>

      <div className="mb-8">

        <div className="flex justify-between text-[11px] mb-3 font-bold uppercase tracking-widest">

          <span className="flex items-center gap-2 text-emerald-400">
            <ThumbsUp size={14} /> {goodPercent}% POSITIVO
          </span>

          <span className="flex items-center gap-2 text-red-400">
            <ThumbsDown size={14} /> {badPercent}% NEGATIVO
          </span>

        </div>

        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-400 h-full"
            style={{ width: `${goodPercent}%` }}
          />
          <div
            className="bg-red-400 h-full"
            style={{ width: `${badPercent}%` }}
          />
        </div>

      </div>

      <div className="space-y-5">

        {comments.map((c, i) => (
          <div
            key={i}
            className="
              bg-[#0f111a]/50
              border border-white/10
              p-5 rounded-2xl
              hover:bg-white/[0.05]
              hover:border-white/20
              transition-all
            "
          >

            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

              <div className="flex items-center gap-3 flex-wrap">

                <span
                  className="
                    bg-blue-500/10
                    text-blue-400
                    px-3 py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    rounded-xl
                    border border-blue-500/20
                  "
                >
                  {c.course}
                </span>

                <div className="flex text-yellow-400">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

              </div>

              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {c.date}
              </span>

            </div>

            <p className="text-[13px] text-gray-200 leading-relaxed mb-4">
              {c.text}
            </p>

            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <ThumbsUp size={12} />
              {c.likes} PERSONAS ENCONTRARON ESTO ÚTIL
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}