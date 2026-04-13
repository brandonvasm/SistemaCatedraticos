import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";

export default function HistoryTrend() {
  const data = [
    { label: "2024-2", value: 3.9, color: "#ef4444" },
    { label: "2025-1", value: 4.0, color: "#f59e0b" },
    { label: "2025-2", value: 4.1, color: "#3b82f6" },
    { label: "2026-1", value: 4.3, color: "#10b981" },
  ];

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
              Evolución de promedio por semestre
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-emerald-500 text-[10px] font-black tracking-widest uppercase">+5.1% MEJORA</span>
        </div>
      </div>

      <div className="relative h-[250px] mx-6 mb-10"> 
        
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
          {[5, 4.3, 3.9, 3.5].map((val) => (
            <div key={val} className="relative w-full border-t border-gray-700/30 border-dashed">
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
              d="M 0 73 L 33 66 L 66 60 L 100 46" 
              fill="none"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex justify-between items-end pb-10">
            {data.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative h-full group/container">
                <motion.div 
                  whileHover={{ scale: 1.4 }}
                  className="absolute w-4 h-4 rounded-full z-30 shadow-lg cursor-pointer border-2 border-[#1e2230]"
                  style={{ 
                    bottom: `${((item.value - 3.5) / (5 - 3.5)) * 100}%`,
                    backgroundColor: item.color,
                    transform: 'translateY(50%)',
                    boxShadow: `0 0 15px ${item.color}66`
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover/container:opacity-100 transition-all border border-white/10 shadow-2xl z-50 whitespace-nowrap">
                    {item.value}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 pt-6 border-t border-white/5 relative z-10">
        {data.map((item, i) => (
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