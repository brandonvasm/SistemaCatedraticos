type Props = {
  active: string;
  setActive: (value: string) => void;
};

const filters = ["Todos", "Excelente", "Bueno", "Bajo"];

export const Filters = ({ active, setActive }: Props) => {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-4
      rounded-2xl
      mb-5
      transition-all duration-300
    ">
      <div className="flex gap-2 md:gap-3 flex-wrap">
        
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`
              px-3 md:px-4 py-1 md:py-2
              rounded-lg text-xs md:text-sm
              transition-all duration-200

              ${active === f
                ? "bg-white/10 text-white"
                : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }
            `}
          >
            {f}
          </button>
        ))}

      </div>
    </div>
  );
};