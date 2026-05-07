import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { teacherService } from "../../services/teacherService";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const res = await teacherService.getGeneralRecommendations();
        setRecommendations(res.recommendations || []);
      } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []); 

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400 opacity-20" />
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl backdrop-blur-2xl shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
          <CheckCircle className="text-emerald-400" size={22} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Recomendaciones Generales
          </h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider leading-relaxed mt-1">
            Guías globales para el desarrollo y optimización del desempeño docente
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {recommendations.map((text, i) => (
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
              <div className="mt-1 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-300 font-medium text-[13px] leading-relaxed">
                  {text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}