import CategoryCard from "./CategoryDecisions";

export default function CategoryDecisions() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-2xl
        mt-8
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 relative z-10">
        <div>
          <h2 className="text-[11px] font-black text-white tracking-tight uppercase">
            Decisiones Automáticas por Categoría
          </h2>

          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
            Recomendaciones del sistema basadas en evaluaciones
          </p>
        </div>

        <button
          className="
            px-5 py-2.5
            bg-yellow-400
            text-black
            rounded-xl
            text-[11px]
            font-black
            uppercase
            tracking-widest
            hover:bg-yellow-300
            hover:scale-[1.05]
            active:scale-95
            transition-all
            shadow-lg shadow-yellow-400/20
          "
        >
          Aplicar Todas
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5 relative z-10">
        <CategoryCard
          title="Excelencia (≥4.5)"
          subtitle="Mantener y promover"
          count={15}
          percent={31}
          examples={[
            "Dr. Carlos Méndez (4.8)",
            "Dra. Ana Rodríguez (4.7)",
          ]}
          bg="bg-green-500/10"
          border="border-green-500/20"
          textColor="text-green-500"
          barColor="bg-green-500"
        />

        <CategoryCard
          title="Muy Bueno (4.0-4.4)"
          subtitle="Mantener"
          count={21}
          percent={44}
          examples={[
            "Ing. Claudia Juárez (4.4)",
          ]}
          bg="bg-white/5"
          border="border-white/10"
          textColor="text-gray-300"
          barColor="bg-white/40"
        />

        <CategoryCard
          title="Aceptable (3.5-3.9)"
          subtitle="Monitorear y capacitar"
          count={6}
          percent={13}
          examples={[
            "Lic. Pedro Martínez (3.8)",
          ]}
          bg="bg-yellow-400/10"
          border="border-yellow-400/20"
          textColor="text-yellow-400"
          barColor="bg-yellow-400"
        />

        <CategoryCard
          title="Requiere Mejora (<3.5)"
          subtitle="Plan de mejora urgente"
          count={6}
          percent={13}
          examples={[
            "Lic. Roberto Mejía (3.2)",
          ]}
          bg="bg-red-500/10"
          border="border-red-500/20"
          textColor="text-red-400"
          barColor="bg-red-400"
        />
      </div>
    </div>
  );
}