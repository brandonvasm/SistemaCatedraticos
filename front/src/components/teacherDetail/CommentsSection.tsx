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
        p-6
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Comentarios de Estudiantes
          </h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            {comments.length} comentarios registrados
          </p>
        </div>

        <button
          className="
            bg-white/5
            border border-white/10
            px-4 py-2
            rounded-xl text-xs md:text-sm
            text-gray-300
            hover:bg-white/10 hover:text-white
            transition
          "
        >
          Filtrar por Curso
        </button>
      </div>

      {/* SENTIMENT BAR */}
      <div className="mb-6">

        <div className="flex justify-between text-xs mb-2 font-medium">

          <span className="flex items-center gap-1 text-emerald-400">
            <ThumbsUp size={14} /> {goodPercent}% Positivo
          </span>

          <span className="flex items-center gap-1 text-red-400">
            <ThumbsDown size={14} /> {badPercent}% Negativo
          </span>

        </div>

        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
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

      {/* COMMENTS */}
      <div className="space-y-4">

        {comments.map((c, i) => (
          <div
            key={i}
            className="
        bg-[#0f111a]/50
              border border-white/10
              p-4 rounded-xl
              hover:bg-white/10
              hover:border-white/20
              transition-all
            "
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">

              <div className="flex items-center gap-2 flex-wrap">

                <span
                  className="
                    bg-blue-500/10
                    text-blue-400
                    px-2 py-1
                    text-[10px]
                    rounded-lg
                    border border-blue-500/20
                  "
                >
                  {c.course}
                </span>

                <div className="flex text-yellow-400">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>

              </div>

              <span className="text-[10px] text-gray-500">
                {c.date}
              </span>

            </div>

            {/* TEXT */}
            <p className="text-sm text-gray-200 leading-relaxed mb-3">
              {c.text}
            </p>

            {/* FOOTER */}
            <div className="text-[11px] text-gray-500 flex items-center gap-2">
              <ThumbsUp size={12} />
              {c.likes} personas encontraron esto útil
            </div>

          </div>
        ))}

      </div>
    </div>
  );
} 