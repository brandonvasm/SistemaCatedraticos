import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  count: number;
  percent: number;

  bg: string;
  border: string;
  textColor: string;
  barColor: string;
};

export default function CategoryCard({
  title,
  count,
  percent,
  bg,
  border,
  textColor,
  barColor,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`
        p-6
        rounded-[1.8rem]
        border
        ${border}
        ${bg}
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:border-white/20
      `}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-white tracking-tight">
            {title}
          </h3>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-white tracking-tighter">
            {count}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            docentes
          </p>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
        Porcentaje del total
      </p>

      <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <button
        onClick={() => navigate("/docentes")}
        className="
          w-full
          py-2.5
          bg-white/5
          border border-white/10
          rounded-xl
          text-[11px]
          font-bold
          text-gray-300
          uppercase
          tracking-wide
          hover:bg-white/10
          hover:border-white/20
          transition-all
          active:scale-95
        "
      >
        Ver Detalles
      </button>
    </div>
  );
}