import { useState } from "react";
import { PieChart as PieIcon, Activity, Users, MousePointer2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TeacherStats } from "../../../types/teacher";

interface PerformancePieProps {
  teachers: TeacherStats[];
  loading?: boolean;
}

export default function PerformancePie({ teachers, loading = false }: PerformancePieProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const counts = {
    excelente: teachers.filter(t => t.promedio_general > 90).length,
    muyBueno: teachers.filter(t => t.promedio_general > 75 && t.promedio_general <= 90).length,
    bueno: teachers.filter(t => t.promedio_general >= 65 && t.promedio_general <= 75).length,
    atencion: teachers.filter(t => t.promedio_general > 0 && t.promedio_general < 65).length,
  };

  const totalEvaluated = Object.values(counts).reduce((a, b) => a + b, 0);

  const stats = [
    { label: "Excelente", range: "> 90 pts", value: counts.excelente, color: "#22c55e", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    { label: "Muy Bueno", range: "76 - 90 pts", value: counts.muyBueno, color: "#3b82f6", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    { label: "Bueno", range: "65 - 75 pts", value: counts.bueno, color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    { label: "Atención", range: "< 65 pts", value: counts.atencion, color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  ];

  const visibleStats = stats.filter(s => s.value > 0);
  let pathAngleAccumulator = -90;
  let labelAngleAccumulator = -90;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 h-full shadow-2xl relative overflow-hidden backdrop-blur-2xl group/main min-h-[520px] flex flex-col"
    >
      <div className="flex items-center gap-4 mb-10 relative z-30">
        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
          <PieIcon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Distribución</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Nivel de desempeño académico</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-20">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-400" strokeWidth={1.5} />
                <div className="absolute inset-0 w-12 h-12 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
              </div>
              <p className="mt-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Obteniendo datos...</p>
            </motion.div>
          ) : totalEvaluated > 0 ? (
            <motion.div 
              key="content-performance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center h-full"
            >
              <div className="flex flex-col gap-4 order-2 lg:order-1">
                <div className="bg-white/5 border border-white/5 p-5 rounded-3xl mb-2">
                  <div className="flex items-center gap-3 mb-1 text-purple-400">
                    <Users size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total</span>
                  </div>
                  <p className="text-2xl font-black text-white">{totalEvaluated} <span className="text-[10px] text-gray-500 uppercase font-bold">Docentes</span></p>
                </div>

                {stats.slice(0, 2).map((s, i) => (
                  <div 
                    key={i} 
                    onMouseEnter={() => {
                      const idx = visibleStats.findIndex(v => v.label === s.label);
                      if (idx !== -1) setActiveIndex(idx);
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`${s.bg} border ${s.border} p-5 rounded-[1.8rem] transition-all duration-300 cursor-pointer ${
                        activeIndex !== null && visibleStats[activeIndex]?.label === s.label ? 'scale-105 ring-1 ring-white/20 opacity-100 shadow-lg' : 'opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${s.text}`}>{s.label}</span>
                        <p className="text-[9px] text-gray-500 font-bold mt-0.5 uppercase">{s.range}</p>
                      </div>
                      <span className="text-xl font-black text-white leading-none">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center order-1 lg:order-2">
                <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_40px_rgba(0,0,0,0.5)] transform -rotate-1">
                    <circle cx="50" cy="50" r="48" fill="#111827" stroke="#1f2937" strokeWidth="1" />
                    
                    {visibleStats.map((item, index) => {
                      const angle = (item.value / totalEvaluated) * 360;
                      const startAngle = pathAngleAccumulator;
                      pathAngleAccumulator += angle;

                      const x1 = 50 + 48 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 48 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 48 * Math.cos((pathAngleAccumulator * Math.PI) / 180);
                      const y2 = 50 + 48 * Math.sin((pathAngleAccumulator * Math.PI) / 180);
                      const largeArcFlag = angle > 180 ? 1 : 0;

                      return (
                        <path
                          key={index}
                          d={`M50,50 L${x1},${y1} A48,48 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                          fill={item.color}
                          stroke="#1e2230" 
                          strokeWidth={activeIndex === index ? "3" : "1.5"}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                          className={`transition-all duration-300 cursor-pointer origin-center ${
                            activeIndex !== null && activeIndex !== index ? "opacity-20 scale-95" : "opacity-100 scale-100"
                          }`}
                        />
                      );
                    })}
                  </svg>

                  <div className="absolute inset-0 pointer-events-none">
                    {visibleStats.map((item, i) => {
                      const sliceAngle = (item.value / totalEvaluated) * 360;
                      const midAngle = labelAngleAccumulator + sliceAngle / 2;
                      labelAngleAccumulator += sliceAngle;
                      const percentage = Math.round((item.value / totalEvaluated) * 100);
                      if (percentage < 5) return null; 
                      
                      return (
                        <div 
                          key={i} 
                          className={`absolute font-black text-[11px] text-white transition-all duration-300 ${
                            activeIndex !== null && activeIndex !== i ? "opacity-0" : "opacity-100"
                          }`}
                          style={{
                            left: `${50 + 30 * Math.cos((midAngle * Math.PI) / 180)}%`,
                            top: `${50 + 30 * Math.sin((midAngle * Math.PI) / 180)}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {percentage}%
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-2 opacity-30 group-hover/main:opacity-100 transition-opacity duration-500">
                   <MousePointer2 size={12} className="text-gray-500" />
                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Interactuar para detalles</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 order-3">
                {stats.slice(2, 4).map((s, i) => (
                  <div 
                    key={i} 
                    onMouseEnter={() => {
                      const idx = visibleStats.findIndex(v => v.label === s.label);
                      if (idx !== -1) setActiveIndex(idx);
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`${s.bg} border ${s.border} p-5 rounded-[1.8rem] transition-all duration-300 cursor-pointer ${
                        activeIndex !== null && visibleStats[activeIndex]?.label === s.label ? 'scale-105 ring-1 ring-white/20 opacity-100 shadow-lg' : 'opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${s.text}`}>{s.label}</span>
                        <p className="text-[9px] text-gray-500 font-bold mt-0.5 uppercase">{s.range}</p>
                      </div>
                      <span className="text-xl font-black text-white leading-none">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty-performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <Activity size={40} className="text-gray-700 mb-4 animate-pulse opacity-20" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Sin registros evaluados</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}