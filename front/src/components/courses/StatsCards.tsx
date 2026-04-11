export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-5 mb-10">

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5
        rounded-[2rem]
        backdrop-blur-2xl
        hover:bg-white/[0.05]
        transition-all
      ">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-3">
          TOTAL CURSOS
        </p>
        <p className="text-3xl font-black text-white">
          6
        </p>
      </div>

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5
        rounded-[2rem]
        backdrop-blur-2xl
        hover:bg-white/[0.05]
        transition-all
      ">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-3">
          PROMEDIO GLOBAL
        </p>
        <p className="text-3xl font-black text-yellow-400">
          4.1
        </p>
      </div>

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5
        rounded-[2rem]
        backdrop-blur-2xl
        hover:bg-white/[0.05]
        transition-all
      ">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-3">
          SECCIONES
        </p>
        <p className="text-3xl font-black text-white">
          41
        </p>
      </div>

      <div className="
        bg-[#0f111a]/50
        border border-white/10
        p-5
        rounded-[2rem]
        backdrop-blur-2xl
        hover:bg-white/[0.05]
        transition-all
      ">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-3">
          ESTUDIANTES
        </p>
        <p className="text-3xl font-black text-white">
          1174
        </p>
      </div>

    </div>
  );
}