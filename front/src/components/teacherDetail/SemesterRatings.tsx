const data = [
  { semester: "2024-2", score: 4.5 },
  { semester: "2025-1", score: 4.6 },
  { semester: "2025-2", score: 4.7 },
  { semester: "2026-1", score: 4.8 },
];

export default function SemesterRatings() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl">

      <h2 className="mb-4">Calificación por Semestre</h2>

      <div className="space-y-3">
        {data.map((d) => (
          <div
            key={d.semester}
            className="flex justify-between bg-slate-700 p-3 rounded-lg"
          >
            <span>{d.semester}</span>
            <span className="text-yellow-400 font-bold">
              {d.score}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}