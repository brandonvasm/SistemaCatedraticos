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
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">

        <div className="
          bg-emerald-500/10
          p-3 rounded-xl
          border border-emerald-500/20
        ">
          <CheckCircle className="text-emerald-400" size={24} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-200">
            Recomendación del Sistema
          </h2>

          <p className="text-sm text-gray-400">
            Basado en el análisis de 245 evaluaciones, tendencia histórica positiva y feedback estudiantil, el sistema recomienda:
          </p>
        </div>

      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-4">

        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="
              bg-white/5
              border border-white/10
              p-4 rounded-xl
              hover:bg-white/10 hover:border-emerald-500/30
              transition-all duration-200
            "
          >

            <div className="flex items-start gap-3">

              <CheckCircle size={16} className="text-emerald-400 mt-1" />

              <div>
                <p className="font-medium text-gray-200">
                  {rec.title}
                </p>

                <p className="text-sm text-gray-400">
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