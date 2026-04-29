export default function Header({ teacher }: { teacher: any }) {
  const name = teacher?.teacher_name || teacher?.name || "Cargando...";
  const score = teacher?.promedio_general ?? teacher?.score ?? 0;
  const totalEvals = teacher?.evaluaciones_total ?? 0;

  const initials = name
    .split(" ")
    .filter((n: string) => n.length > 0)
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-4xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 text-yellow-400 border border-yellow-400/20">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
              {name}
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
              Docente 
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-black text-yellow-400">
            {Number(score).toFixed(2)}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">
            {totalEvals} EVALUACIONES
          </p>
        </div>

      </div>
    </div>
  );
}