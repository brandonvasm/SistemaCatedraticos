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
    <div className="bg-[#1c2746] p-6 rounded-xl border border-green-500/30">

      <div className="flex items-start gap-4 mb-6">

        <div className="bg-green-500/20 p-3 rounded-xl">
          <CheckCircle className="text-green-400" size={24} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Recomendación del Sistema
          </h2>

          <p className="text-sm text-gray-300">
            Basado en el análisis de 245 evaluaciones, tendencia histórica positiva y feedback estudiantil, el sistema recomienda:
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="bg-[#243056] p-4 rounded-xl border border-slate-600 hover:border-green-400 transition"
          >

            <div className="flex justify-between items-start">

              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 mt-1" />

                <div>
                  <p className="font-medium">
                    {rec.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    {rec.description}
                  </p>
                </div>
              </div>


            </div>

          </div>
        ))}

      </div>
    </div>
  );
}