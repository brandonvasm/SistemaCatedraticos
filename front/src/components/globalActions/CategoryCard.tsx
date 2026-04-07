import CategoryCard from "./CategoryDecisions";

export default function CategoryDecisions() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl mt-6">

      <div className="flex justify-between mb-6">
        <div>
          <h2 className="font-semibold">
            Decisiones Automáticas por Categoría
          </h2>
          <p className="text-sm text-gray-400">
            Recomendaciones del sistema basadas en evaluaciones
          </p>
        </div>

        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm">
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
          bg="bg-gradient-to-br from-green-900/40 to-green-700/20"
          border="border-green-500/40"
          textColor="text-green-400"
          barColor="bg-green-400"
        />

        <CategoryCard
          title="Muy Bueno (4.0-4.4)"
          subtitle="Mantener"
          count={21}
          percent={44}
          examples={[
            "Ing. Claudia Juárez (4.4)",
          ]}
          bg="bg-gradient-to-br from-blue-900/40 to-blue-700/20"
          border="border-blue-500/40"
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
          bg="bg-gradient-to-br from-yellow-900/40 to-yellow-700/20"
          border="border-yellow-500/40"
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
          bg="bg-gradient-to-br from-red-900/40 to-red-700/20"
          border="border-red-500/40"
          textColor="text-red-400"
          barColor="bg-red-400"
        />

      </div>
    </div>
  );
}