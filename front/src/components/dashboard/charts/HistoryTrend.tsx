import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2,Calendar, BarChart3 } from "lucide-react";
import { chartService } from "../../../services/chartService";

interface TrendData {
  semester_id: number;
  semester_label: string;
  avg_score: number;
  is_current: boolean;
}

export default function HistoryTrend({ facultyId }: { facultyId: number | undefined }) {
  const [history, setHistory] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#facc15", "#34d399", "#60a5fa", "#f87171", "#a78bfa"];

  useEffect(() => {
    if (facultyId) {
      setLoading(true);
      chartService.getHistoricalTrend(facultyId)
        .then(data => setHistory(data))
        .catch(err => console.error("Error al cargar tendencia:", err))
        .finally(() => setLoading(false));
    }
  }, [facultyId]);

  const chartProps = useMemo(() => {
    if (!history || history.length === 0) return null;

    const values = history.map(h => h.avg_score);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const yMax = Math.max(5, maxVal + 0.2);
    const yMin = Math.min(3.5, minVal - 0.2);
    const yRange = yMax - yMin;

    const yAxisLabels = [yMax, yMax - yRange * 0.33, yMax - yRange * 0.66, yMin];

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((h.avg_score - yMin) / yRange) * 100;
      const color = colors[i % colors.length];

      return { x, y, value: h.avg_score, label: h.semester_label, color };
    });

    const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    const first = history[0].avg_score;
    const last = history[history.length - 1].avg_score;
    const improvement = (((last - first) / (first || 1)) * 100).toFixed(1);

    return { points, lineD, yAxisLabels, improvement, yMin, yMax };
  }, [history]);

  if (loading) return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 h-[520px] flex items-center justify-center backdrop-blur-2xl">
      <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[520px] flex flex-col backdrop-blur-2xl relative overflow-hidden group w-full mx-auto"
    >
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-yellow-400">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
              Tendencia Histórica
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">
              Promedio últimos 4 semestres
            </p>
          </div>
        </div>
      </div>


      <div className="relative flex-1 ml-12 mr-6 mb-12 mt-4"> 
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
          {chartProps?.yAxisLabels.map((val, i) => (
            <div key={i} className="relative w-full border-t border-white/5 border-dashed flex items-center">
              <span className="absolute -left-12 text-[9px] font-black text-gray-600 uppercase tracking-tighter w-10 text-right pr-2">
                {val.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-full w-full">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="absolute inset-0 w-full h-full overflow-visible"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={chartProps?.lineD || ""} 
              fill="none"
              stroke="white"
              strokeOpacity="0.15"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0">
            {chartProps?.points.map((item, i) => (
              <div 
                key={i} 
                className="absolute flex flex-col items-center group/dot" 
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.4 }}
                  className="w-4 h-4 rounded-full z-30 border-[3px] border-[#1e2230] cursor-pointer shadow-2xl transition-transform"
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 20px ${item.color}44` 
                  }}
                />
                
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0f111a] text-white border border-white/10 px-3 py-1.5 rounded-xl opacity-0 group-hover/dot:opacity-100 transition-all pointer-events-none shadow-2xl z-50">
                  <p className="text-[8px] font-black tracking-widest uppercase mb-0.5 text-gray-500">{item.label}</p>
                  <p className="text-[11px] font-bold text-center leading-none">{(item.value ?? 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
          <Calendar size={18} className="text-blue-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1.5">Último Semestre</p>
            <p className="text-[11px] font-bold text-white uppercase tracking-tight">
              {history[history.length - 4]?.semester_label || "---"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
          <BarChart3 size={18} className="text-yellow-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1.5">Total Semestres</p>
            <p className="text-[11px] font-bold text-white">{history.length} Semestres</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}