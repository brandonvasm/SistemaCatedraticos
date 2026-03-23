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
    <div className="bg-[#1c2746] p-6 rounded-xl">

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-semibold">
            Comentarios Anónimos de Estudiantes
          </h2>
          <p className="text-sm text-gray-400">
            {comments.length} comentarios totales
          </p>
        </div>

        <button className="bg-slate-700 px-3 py-1 rounded-lg text-sm">
          Filtrar por Curso
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="flex items-center gap-1 text-green-400">
            <ThumbsUp size={14} /> {goodPercent}% Positivo
          </span>

          <span className="flex items-center gap-1 text-red-400">
            <ThumbsDown size={14} /> {badPercent}% Negativo
          </span>
        </div>

        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400"
            style={{ width: `${goodPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((c, i) => (
          <div
            key={i}
            className="bg-[#243056] p-4 rounded-xl border border-slate-700"
          >

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs rounded">
                  {c.course}
                </span>

                <div className="flex text-yellow-400">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <span className="text-xs text-gray-400">
                {c.date}
              </span>
            </div>

            <p className="text-sm text-gray-200 mb-3">
              {c.text}
            </p>

            <div className="text-xs text-gray-400 flex items-center gap-2">
              {c.likes} personas encontraron esto útil
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}