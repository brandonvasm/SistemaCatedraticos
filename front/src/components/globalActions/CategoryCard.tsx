import CategoryCard from "./CategoryDecisions";

export default function CategoryDecisions() {
  return (
    <div className="bg-[#0f111a]/50 border border-white/10 p-6 rounded-2xl backdrop-blur-2xl shadow-xl mt-6">

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

        <div>
          <h2 className="font-bold text-white tracking-tight">
            Decisiones Automáticas por Categoría
          </h2>
          <p className="text-sm text-gray-500">
            Recomendaciones del sistema basadas en evaluaciones
          </p>
        </div>

        <button className="
          bg-yellow-400/90
          text-black
          px-4 py-2
          rounded-lg
          text-sm font-semibold
          hover:bg-yellow-300
          active:scale-95
          transition-all
        ">
          Aplicar Todas
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <CategoryCard
          title="Excelencia (≥4.5)"
          subtitle="Mantener y promover"
          count={15}
          percent={31}
          examples={[
            "Dr. Carlos Méndez (4.8)",
            "Dra. Ana Rodríguez (4.7)",
          ]}
          bg="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"
          border="border-emerald-500/20"
          textColor="text-emerald-400"
          barColor="bg-emerald-400"
        />

        <CategoryCard
          title="Muy Bueno (4.0-4.4)"
          subtitle="Mantener"
          count={21}
          percent={44}
          examples={[
            "Ing. Claudia Juárez (4.4)",
          ]}
          bg="bg-gradient-to-br from-blue-500/10 to-blue-500/5"
          border="border-blue-500/20"
          textColor="text-blue-400"
          barColor="bg-blue-400"
        />

        <CategoryCard
          title="Aceptable (3.5-3.9)"
          subtitle="Monitorear y capacitar"
          count={6}
          percent={13}
          examples={[
            "Lic. Pedro Martínez (3.8)",
          ]}
          bg="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5"
          border="border-yellow-500/20"
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
          bg="bg-gradient-to-br from-red-500/10 to-red-500/5"
          border="border-red-500/20"
          textColor="text-red-400"
          barColor="bg-red-400"
        />

      </div>
    </div>
  );
}