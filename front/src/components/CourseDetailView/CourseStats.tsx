export default function CourseStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

      <Stat title="SECCIONES" value="7" />
      <Stat title="ESTUDIANTES" value="245" />
      <Stat title="PROMEDIO" value="4.5" highlight />
      <Stat title="RECOMENDACIÓN" value="92%" />

    </div>
  );
}

function Stat({ title, value, highlight = false }: any) {
  return (
    <div
      className="
        bg-[#0f111a]/50
        border border-white/10
        backdrop-blur-2xl
        p-5
        rounded-[2rem]
        hover:bg-white/[0.05]
        transition-all
      "
    >
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-3">
        {title}
      </p>

      <p className={`text-3xl font-black ${highlight ? "text-yellow-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}