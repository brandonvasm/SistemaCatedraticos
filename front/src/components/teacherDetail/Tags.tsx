export default function Tags() {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">
      <h2 className="mb-4 text-gray-200 font-semibold">
        Cursos que puede impartir
      </h2>

      <div className="flex flex-wrap gap-2">
        {["Cálculo I", "Cálculo II"].map((c) => (
          <span
            key={c}
            className="
              bg-blue-500/10
              text-blue-300
              px-3 py-1
              rounded-lg
              text-xs md:text-sm
              border border-blue-500/20
              hover:bg-blue-500/20
              transition
            "
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}