export default function Tags() {
  return (
    <div className="bg-[#1e293b] p-6 rounded-xl">
      <h2 className="mb-4">Cursos que puede impartir</h2>

      <div className="flex flex-wrap gap-2">
        {["Cálculo I", "Cálculo II"].map((c) => (
          <span key={c} className="bg-slate-700 px-3 py-1 rounded-lg">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}