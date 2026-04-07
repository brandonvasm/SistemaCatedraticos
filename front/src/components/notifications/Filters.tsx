export default function Filters() {
  const filters = [
    "Todas (8)",
    "No Leídas (3)",
    "Requieren Acción (3)",
    "Prioridad Alta (3)",
    "Prioridad Media (3)",
  ];

  return (
    <div className="bg-[#1c2746] p-4 rounded-xl mb-6">

      <p className="mb-3 text-sm font-semibold">
        Filtrar Notificaciones
      </p>

      <div className="flex flex-wrap gap-3">

        {filters.map((f, i) => (
          <button
            key={i}
            className={`
              px-4 py-2 rounded-lg text-sm
              ${i === 0
                ? "bg-yellow-400 text-black"
                : "bg-white/5 hover:bg-white/10"}
            `}
          >
            {f}
          </button>
        ))}

      </div>

    </div>
  );
}