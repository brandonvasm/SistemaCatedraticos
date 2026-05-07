import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { teacherService } from "../../../services/teacherService";

interface WorkloadData {
  teacher_id: number;
  teacher_name: string;
  total_credits: number;
  avg_score: number | null;
}

export default function PerformanceScatter({ facultyId }: { facultyId: number }) {
  const [points, setPoints] = useState<WorkloadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (facultyId) {
      setLoading(true);
      teacherService.getTeacherWorkload(facultyId)
        .then(data => setPoints(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [facultyId]);

  const { maxCredits, maxScore } = useMemo(() => {
    const credits = points.map(p => p.total_credits || 0);
    const scores = points.map(p => p.avg_score || 0);
    return {
      maxCredits: Math.max(...credits, 10) * 1.1,
      maxScore: Math.max(...scores, 5) * 1.05
    };
  }, [points]);

  const getColor = (score: number | null) => {
    const s = score ?? 0;
    const ratio = s / maxScore;
    if (ratio >= 0.9) return "bg-green-500";
    if (ratio >= 0.8) return "bg-blue-500";
    if (ratio >= 0.7) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 shadow-2xl h-[450px] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-purple-500/20">C</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">Carga vs Rendimiento</h3>
            <p className="text-sm text-gray-500">Relación créditos y calificación</p>
          </div>
        </div>

        <div className="relative h-[250px] w-full flex mt-4">

          <div className="relative flex flex-col justify-between text-[11px] font-bold text-gray-600 pr-10 pb-10 italic w-20 text-right">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-[0.3em] text-gray-500 whitespace-nowrap">
              Calificación
            </div>
            <span>{maxScore > 10 ? maxScore.toFixed(0) : maxScore.toFixed(1)}</span>
            <span>{(maxScore / 2).toFixed(1)}</span>
            <span>0</span>
          </div>

          <div className="relative flex-1 border-l border-b border-gray-700/50 mb-10 mr-4">
            {!loading && (
              <>
                {points.map((p, i) => (
                  <motion.div
                    key={p.teacher_id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.03, type: "spring" }}
                    whileHover={{ scale: 1.8, zIndex: 50 }}
                    className={`absolute w-4 h-4 rounded-full ${getColor(p.avg_score)} border-2 border-[#1e2230] shadow-xl cursor-crosshair group`}
                    style={{ 
                      left: `${((p.total_credits || 0) / maxCredits) * 100}%`, 
                      bottom: `${((p.avg_score || 0) / maxScore) * 100}%`,
                      transform: 'translate(-50%, 50%)' 
                    }}
                  >
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none whitespace-nowrap z-50">
                      <span className="text-gray-400 block mb-0.5 uppercase">{p.teacher_name}</span>
                      {(p.avg_score ?? 0).toFixed(1)} PTS — <span className="text-blue-600">{p.total_credits} CRÉDITOS</span>
                    </div>
                  </motion.div>
                ))}
                
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold whitespace-nowrap">
                  Créditos Totales
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
        {[
          { color: "bg-green-500", text: "Excelente" },
          { color: "bg-blue-500", text: "Muy Bueno" },
          { color: "bg-orange-500", text: "Bueno" },
          { color: "bg-red-500", text: "Atención" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}