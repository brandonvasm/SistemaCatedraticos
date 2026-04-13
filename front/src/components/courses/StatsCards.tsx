export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-5 mb-10">
      
      <div
        className="
          group relative
          bg-white/[0.02]
          border border-white/5
          p-5
          rounded-[2rem]
          backdrop-blur-2xl
          hover:bg-white/[0.05]
          hover:border-white/20
          transition-all
          overflow-hidden
        "
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 relative z-10">
          TOTAL CURSOS
        </p>

        <p className="text-3xl font-black text-white relative z-10">
          6
        </p>
      </div>

      <div
        className="
          group relative
          bg-white/[0.02]
          border border-white/5
          p-5
          rounded-[2rem]
          backdrop-blur-2xl
          hover:bg-white/[0.05]
          hover:border-yellow-400/30
          transition-all
          overflow-hidden
        "
      >
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/[0.04] blur-[70px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 relative z-10">
          PROMEDIO GLOBAL
        </p>

        <p className="text-3xl font-black text-yellow-400 relative z-10">
          4.1
        </p>
      </div>

      <div
        className="
          group relative
          bg-white/[0.02]
          border border-white/5
          p-5
          rounded-[2rem]
          backdrop-blur-2xl
          hover:bg-white/[0.05]
          hover:border-white/20
          transition-all
          overflow-hidden
        "
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 relative z-10">
          SECCIONES
        </p>

        <p className="text-3xl font-black text-white relative z-10">
          41
        </p>
      </div>

      <div
        className="
          group relative
          bg-white/[0.02]
          border border-white/5
          p-5
          rounded-[2rem]
          backdrop-blur-2xl
          hover:bg-white/[0.05]
          hover:border-white/20
          transition-all
          overflow-hidden
        "
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-3 relative z-10">
          ESTUDIANTES
        </p>

        <p className="text-3xl font-black text-white relative z-10">
          1174
        </p>
      </div>

    </div>
  );
}