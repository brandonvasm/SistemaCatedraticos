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
      bg-white/[0.02]
      border border-white/10
      p-6
      rounded-[2rem]
      backdrop-blur-2xl
      shadow-2xl
      mb-10
    ">

      <p className="mb-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
        FILTRAR NOTIFICACIONES
      </p>

      <div className="flex flex-wrap gap-3">

        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`
              px-5 py-2.5
              rounded-2xl
              text-[10px]
              font-bold
              uppercase
              tracking-widest
              transition-all duration-300
              active:scale-95

              ${
                active === f
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
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