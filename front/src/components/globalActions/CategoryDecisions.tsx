type Props = {
  title: string;
  subtitle: string;
  count: number;
  percent: number;
  examples: string[];

  bg: string;
  border: string;
  textColor: string;
  barColor: string;
};

export default function CategoryCard({
  title,
  subtitle,
  count,
  percent,
  examples,
  bg,
  border,
  textColor,
  barColor,
}: Props) {
  return (
    <div
      className={`p-5 rounded-xl border ${border} ${bg} transition hover:scale-[1.01]`}
    >

      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className={`${textColor} text-sm font-medium`}>
            {subtitle}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-xs text-gray-400">docentes</p>
        </div>
      </div>

      {/* PROGRESS */}
      <p className="text-xs text-gray-400 mb-1">
        Porcentaje del total
      </p>

      <div className="w-full h-2 bg-slate-600 rounded mb-3">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* EJEMPLOS */}
      <div className="text-xs text-gray-300 mb-4">
        <p className="mb-1">Ejemplos:</p>
        {examples.map((e, i) => (
          <p key={i}>• {e}</p>
        ))}
      </div>

      {/* BUTTON */}
      <button className="w-full bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm transition">
        Ver Detalles
      </button>
    </div>
  );
}