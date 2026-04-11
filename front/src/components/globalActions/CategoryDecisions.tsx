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

          <p className={`${textColor} text-[11px] font-bold uppercase tracking-wide mt-1`}>
            {subtitle}
          </p>
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
          className={`h-full ${barColor} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-[11px] text-gray-400 mb-5 space-y-1">
        <p className="uppercase tracking-wider text-gray-500 text-[10px]">
          Ejemplos
        </p>
        {examples.map((e, i) => (
          <p key={i}>• {e}</p>
        ))}
      </div>

      <button className="
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
      ">
        Ver Detalles
      </button>

    </div>
  );
}