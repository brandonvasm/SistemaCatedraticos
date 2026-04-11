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
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          CALIFICACIÓN POR SEMESTRE
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          EVOLUCIÓN DEL RENDIMIENTO
        </p>
      </div>

      <div className="space-y-4">

        {data.map((d) => {
          const color = getColor(d.score);

          return (
            <div
              key={d.semester}
              className="
                bg-[#0f111a]/50
                border border-white/10
                p-4 rounded-2xl
                hover:bg-white/[0.05]
                hover:border-white/20
                transition-all
              "
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  {d.semester}
                </span>

                <span className="text-lg font-black text-white">
                  {d.score}
                </span>
              </div>

              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">

                <div
                  className={`
                    h-2 rounded-full
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