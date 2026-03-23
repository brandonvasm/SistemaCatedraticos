type Props = {
  active: string;
  setActive: (value: string) => void;
};

const filters = ["Todos", "Excelente", "Bueno", "Bajo"];

export const Filters = ({ active, setActive }: Props) => {
  return (
    <div className="bg-[#1e293b] p-4 rounded-2xl mb-5">
      <div className="flex gap-2 md:gap-3 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm transition ${
              active === f
                ? "bg-yellow-400 text-black"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};