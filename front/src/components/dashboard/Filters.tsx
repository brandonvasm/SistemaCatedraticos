type Props = {
  active: string;
  setActive: (value: string) => void;
};

const filters = ["Todos", "Excelente", "Bueno", "Bajo"];

export const Filters = ({ active, setActive }: Props) => {
  return (
    <div className="
      w-full
      mb-6
      p-4
      rounded-2xl
      border border-white/10
      bg-[#0f111a]/50
      backdrop-blur-2xl
      shadow-xl
    ">

      {/* TITLE */}
      <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mb-3">
        Filtrar por estado
      </p>

      {/* BUTTONS */}
      <div className="flex gap-2 md:gap-3 flex-wrap">

        {filters.map((f) => {
          const isActive = active === f;

          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`
                px-4 py-2
                rounded-xl
                text-xs md:text-sm
                font-semibold
                tracking-wide
                transition-all duration-300
                border

                ${isActive
                  ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30 shadow-inner"
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10"
                }
              `}
            >
              {f}
            </button>
          );
        })}

      </div>

    </div>
  );
};