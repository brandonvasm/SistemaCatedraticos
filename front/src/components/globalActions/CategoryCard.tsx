import CategoryCard from "./CategoryDecisions";

export default function CategoryDecisions() {
  return (
    <div className="bg-secondary/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md shadow-xl mt-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-56 h-56 bg-yellow-400/10 blur-[100px] rounded-full -ml-28 -mt-28 opacity-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 relative z-10">
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            Decisiones Automáticas por Categoría
          </p>

          <p className="text-gray-500 text-[10px] leading-tight font-medium">
            Recomendaciones del sistema basadas en evaluaciones
          </p>
        </div>

        <button className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
          Aplicar Todas
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
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