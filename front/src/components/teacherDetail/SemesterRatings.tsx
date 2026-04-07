const data = [
  { semester: "2024-2", score: 4.5 },
  { semester: "2025-1", score: 4.6 },
  { semester: "2025-2", score: 4.7 },
  { semester: "2026-1", score: 4.8 },
];

export default function SemesterRatings() {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">

      <h2 className="mb-4 text-gray-200 font-semibold">
        Calificación por Semestre
      </h2>

      <div className="space-y-3">
        {data.map((d) => (
          <div
            key={d.semester}
            className="
              bg-white/5
              border border-white/10
              p-3 rounded-lg
              hover:bg-white/10
              transition
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                {d.semester}
              </span>

              <span className="text-blue-400 font-bold">
                {d.score}
              </span>
            </div>

            {/* Barra PRO */}
            <div className="w-full bg-white/5 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-1 rounded-full"
                style={{ width: `${d.score * 20}%` }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}