import { useState } from "react";

export default function Filters() {
  const filters = [
    "Todas (8)",
    "No Leídas (3)",
    "Requieren Acción (3)",
    "Prioridad Alta (3)",
    "Prioridad Media (3)",
  ];

  const [active, setActive] = useState(filters[0]);

  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-5
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
      mb-6
    ">

      <p className="mb-4 text-sm font-semibold text-gray-300 tracking-tight">
        Filtrar Notificaciones
      </p>

      <div className="flex flex-wrap gap-3">

        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`
              px-4 py-2
              rounded-xl
              text-sm
              font-medium
              transition-all
              active:scale-95

              ${
                active === f
                  ? "bg-yellow-400/90 text-black shadow-sm"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {f}
          </button>
        ))}

      </div>

    </div>
  );
}