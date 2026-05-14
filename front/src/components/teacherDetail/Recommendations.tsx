import { useState, useEffect } from "react";
import { CheckCircle, Loader2,  BrainCircuit, Activity } from "lucide-react";
import { teacherService } from "../../services/teacherService";

interface TeacherAnalysis {
  id: number;
  title: string;
  profile_overview: string;
  perception: string;
  model_version: string;
}

export default function Recommendations({ teacherId }: { teacherId: string | number }) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<TeacherAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!teacherId) return;
      try {
        setLoading(true);
        const [resGeneral, resAnalysis] = await Promise.all([
          teacherService.getGeneralRecommendations(),
          teacherService.getTeacherAnalysis(Number(teacherId))
        ]);

        setRecommendations(resGeneral.recommendations || []);
        setAnalysis(resAnalysis);
      } catch (error) {
        console.error("Error en analítica:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400/50" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Procesando..</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {analysis && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                <BrainCircuit className="text-yellow-400" size={18} />
              </div>
              <div>
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                  {analysis.title || "Resumen del Perfil"}
                </h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  ANALISIS: <span className="text-yellow-400/80">{analysis.perception}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Engine v.{analysis.model_version}</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/5 to-transparent rounded-[2rem] blur opacity-25" />
            <div className="relative bg-white/[0.02] border border-white/5 p-7 rounded-[2rem] hover:border-white/10 transition-colors">
              <p className="text-gray-300 text-[13px] leading-[1.8] font-medium italic">
                "{analysis.profile_overview}"
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-1">
          <Activity className="text-gray-500" size={16} />
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            Analisis del docente - promedio menor a 85
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((text, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-yellow-400/20 transition-all duration-300"
              >
                <div className="mt-1">
                  <CheckCircle size={14} className="text-yellow-400/40 group-hover:text-yellow-400 transition-colors" />
                </div>
                <p className="text-gray-400 font-bold text-[11px] uppercase leading-relaxed tracking-tight group-hover:text-gray-200 transition-colors">
                  {text}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 border border-white/5 border-dashed rounded-3xl flex items-center justify-center">
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">No hay analisis del docente</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}