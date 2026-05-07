import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
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
      


      const hue = (i * 137.5) % 360; 
      const color = `hsl(${hue}, 70%, 60%)`;

      return { x, y, value: h.avg_score, label: h.semester_label, color };
    });

    const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    const first = history[0].avg_score;
    const last = history[history.length - 1].avg_score;
    const improvement = (((last - first) / (first || 1)) * 100).toFixed(1);

    return { points, lineD, yAxisLabels, improvement, yMin, yMax };
  }, [history]);

  if (loading) return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 h-[450px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-yellow-400 animate-spin opacity-20" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 shadow-2xl h-full relative overflow-hidden group w-full mx-auto"
    >
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-yellow-400">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Tendencia Histórica
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Evolución (general) de promedio por semestre
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-[250px] mx-6 mb-10"> 
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
          {chartProps?.yAxisLabels.map((val, i) => (
            <div key={i} className="relative w-full border-t border-gray-700/30 border-dashed">
              <span className="absolute -left-12 -top-2.5 text-xs font-bold text-gray-500 w-10 text-right tracking-tight">
                {val.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-full w-full px-4">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="absolute inset-0 w-full h-full overflow-visible"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={chartProps?.lineD || ""} 
              fill="none"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex justify-between items-end pb-10">
            {chartProps?.points.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative h-full group/container">
                <motion.div 
                  whileHover={{ scale: 1.4 }}
                  className="absolute w-4 h-4 rounded-full z-30 shadow-lg cursor-pointer border-2 border-[#1e2230]"
                  style={{ 
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    backgroundColor: item.color,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 15px ${item.color}88` 
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover/container:opacity-100 transition-all border border-white/10 shadow-2xl z-50 whitespace-nowrap">
                    {(item.value ?? 0).toFixed(2)}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 pt-6 border-t border-white/5 relative z-10">
        {chartProps?.points.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}