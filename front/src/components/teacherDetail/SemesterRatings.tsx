const data = [
  { semester: "2024-2", score: 4.5 },
  { semester: "2025-1", score: 4.6 },
  { semester: "2025-2", score: 4.7 },
  { semester: "2026-1", score: 4.8 },
];

export default function SemesterRatings() {

  const getColor = (score: number) => {
    if (score >= 4.5) return "bg-emerald-400";
    if (score >= 4) return "bg-blue-400";
    return "bg-red-400";
  };

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
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Calificación por Semestre
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Evolución del rendimiento
        </p>
      </div>

      {/* LISTA */}
      <div className="space-y-3">

        {data.map((d) => {
          const color = getColor(d.score);

          return (
            <div
              key={d.semester}
              className="
        bg-[#0f111a]/50
                border border-white/10
                p-3 rounded-xl
                hover:bg-white/10
                hover:border-white/20
                transition-all
              "
            >
              {/* HEADER ROW */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300 font-medium">
                  {d.semester}
                </span>

                <span className="text-sm font-bold text-white">
                  {d.score}
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">

                <div
                  className={`
                    h-1.5 rounded-full
                    ${color}
                  `}
                  style={{ width: `${d.score * 20}%` }}
                />

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}