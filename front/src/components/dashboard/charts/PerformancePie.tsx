import { PieChart as PieIcon, Activity } from "lucide-react";
import type { TeacherStats } from "../../../types/teacher";

interface PerformancePieProps {
  teachers: TeacherStats[];
}

export default function PerformancePie({ teachers }: PerformancePieProps) {
  const counts = {
    excelente: teachers.filter(t => t.promedio_general > 90).length,
    muyBueno: teachers.filter(t => t.promedio_general > 75 && t.promedio_general <= 90).length,
    bueno: teachers.filter(t => t.promedio_general >= 65 && t.promedio_general <= 75).length,
    atencion: teachers.filter(t => t.promedio_general > 0 && t.promedio_general < 65).length,
  };

  const totalEvaluated = Object.values(counts).reduce((a, b) => a + b, 0);

  const stats = [
    { label: "Excelente", value: counts.excelente, color: "#22c55e" },
    { label: "Muy Bueno", value: counts.muyBueno, color: "#3b82f6" },
    { label: "Bueno", value: counts.bueno, color: "#f59e0b" },
    { label: "Atención", value: counts.atencion, color: "#ef4444" },
  ].filter(s => s.value > 0);

  let pathAngleAccumulator = -90;
  let labelAngleAccumulator = -90;

  return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-6 h-full shadow-2xl relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
          <PieIcon size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold text-white tracking-tight">Distribución</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Por nivel de desempeño</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {totalEvaluated > 0 ? (
          <>
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#111827" stroke="#1f2937" strokeWidth="1" />
                
                {stats.map((item, index) => {
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
                      strokeWidth="1.5"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 pointer-events-none">
                {stats.map((item, i) => {
                  const sliceAngle = (item.value / totalEvaluated) * 360;
                  const midAngle = labelAngleAccumulator + sliceAngle / 2;
                  labelAngleAccumulator += sliceAngle; // Actualizar para el siguiente label

                  const percentage = Math.round((item.value / totalEvaluated) * 100);
                  if (percentage < 5) return null; 
                  
                  return (
                    <div 
                      key={i} 
                      className="absolute font-black text-[10px] text-white drop-shadow-md"
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

            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 mt-10">
              {stats.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.label}</span>
                    <span className="text-[9px] text-gray-600 font-medium mt-0.5">{item.value} Docentes</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-56 w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
              <Activity size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Esperando Evaluaciones</p>
              <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">No hay docentes con promedio mayor a 0.0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}