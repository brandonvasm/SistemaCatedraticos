import { CheckCircle } from "lucide-react";

const recommendations = [
  {
    title: "Mantener Cursos Actuales",
    description: "Excelente desempeño en todas las secciones asignadas",
  },
  {
    title: "Ampliar Carga Académica",
    description: "Capacidad para asumir más responsabilidades",
  },
  {
    title: "Considerar para Posgrado",
    description: "Calificado para cursos de nivel avanzado",
  },
  {
    title: "Mentor de Nuevos Docentes",
    description: "Puede compartir mejores prácticas",
  },
];

export default function Recommendations() {
  return (
    <div
      className="
        p-6
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >

      {/* HEADER */}
      <div className="flex items-start gap-4 mb-6">

        <div
          className="
            bg-emerald-500/10
            p-3 rounded-2xl
            border border-emerald-500/20
          "
        >
          <CheckCircle className="text-emerald-400" size={22} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Recomendación del Sistema
          </h2>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider leading-relaxed mt-1">
            Basado en evaluaciones, tendencias históricas y feedback estudiantil
          </p>
        </div>

      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 gap-4">

        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="
        bg-[#0f111a]/50
              border border-white/10
              p-4 rounded-xl
              hover:bg-white/10
              hover:border-emerald-500/30
              transition-all duration-300
            "
          >

            <div className="flex items-start gap-3">

              <div className="
                mt-1
                p-1.5
                rounded-lg
                bg-emerald-500/10
                border border-emerald-500/20
              ">
                <CheckCircle size={14} className="text-emerald-400" />
              </div>

              <div>
                <p className="text-white font-semibold text-sm">
                  {rec.title}
                </p>

                <p className="text-[12px] text-gray-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}