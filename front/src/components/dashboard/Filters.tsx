type Props = {
  active: string;
  setActive: (value: string) => void;
};

const filters = ["Todos", "Excelente (>= 65)", "Bajo"];

export const Filters = ({ active, setActive }: Props) => {
  return (
    <div className="
      w-full
      mb-6
      p-6
      rounded-3xl
      border border-white/10
      bg-[#0f111a]/50
      backdrop-blur-2xl
      shadow-xl
    ">

      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-5 ml-1">
        FILTRAR POR ESTADO
      </p>

      <div className="flex gap-3 flex-wrap">

        {filters.map((f) => {
          const isActive = active === f;

          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`
                px-6 py-3
                rounded-2xl
                text-[11px]
                font-bold
                uppercase
                tracking-widest
                transition-all duration-300
                border

                ${isActive
                  ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30 shadow-inner scale-95"
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10 hover:scale-105"
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