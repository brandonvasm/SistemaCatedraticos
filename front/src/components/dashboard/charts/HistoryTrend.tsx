import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function HistoryTrend() {
  const data = [
    { label: "2024-2", value: 3.9 },
    { label: "2025-1", value: 4.0 },
    { label: "2025-2", value: 4.1 },
    { label: "2026-1", value: 4.3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 shadow-2xl h-full relative overflow-hidden group"
    >

      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-xl font-bold text-white  italic ">Tendencia Histórica</h3>
          <p className="text-sm text-gray-500 font-medium">Evolución de promedio por semestre</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <TrendingUp size={14} className="text-green-500" />
          <span className="text-green-500 text-[10px] font-black tracking-widest">+5.1% MEJORA</span>
        </div>
      </div>


      <div className="relative h-[250px] w-full mt-4 pl-14 pr-4">
  
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-20 z-20">
          {[5, 4.3, 3.9, 3.5].map((val) => (
            <div key={val} className="relative w-full border-t border-gray-700/30 border-dashed">
              <span className="absolute -left-12 -top-2.5 text-[12px] font-black text-gray-400 w-10 text-right">
                {val.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-full w-full z-10">
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
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            />
          </svg>

          <div className="absolute inset-0 flex justify-between items-end pb-10">
            {data.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative h-full group/container">
                <motion.div 
                  whileHover={{ scale: 1.4 }}
                  className="absolute w-4 h-4 bg-white border-2 border-[#fbbf24] rounded-full z-30 shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer"
                  style={{ 
                    bottom: `${((item.value - 3.5) / (5 - 3.5)) * 100}%`,
                    transform: 'translateY(50%)' 
                  }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover/container:opacity-100 transition-all border border-white/10 shadow-2xl z-50 whitespace-nowrap">
                    NOTA: {item.value}
                  </div>
                </motion.div>

                <div className="absolute -bottom-10">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-tighter italic">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}