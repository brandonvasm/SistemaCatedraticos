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
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-2xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <p className="mb-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] relative z-10">
        FILTRAR NOTIFICACIONES
      </p>

      <div className="flex flex-wrap gap-3 relative z-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`
              px-5 py-2.5
              rounded-2xl
              text-[10px]
              font-black
              uppercase
              tracking-widest
              transition-all duration-300
              active:scale-95

              ${
                active === f
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
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