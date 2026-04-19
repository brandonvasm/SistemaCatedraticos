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
        group relative
        bg-white/[0.02]
        border border-white/5
        backdrop-blur-2xl
        p-5
        rounded-[2rem]
        hover:bg-white/[0.05]
        hover:border-white/20
        transition-all
        overflow-hidden
      "
    >
      {highlight && (
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/[0.04] blur-[70px] rounded-full pointer-events-none" />
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 relative z-10">
        {title}
      </p>

      <p
        className={`text-3xl font-black relative z-10 ${
          highlight ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}