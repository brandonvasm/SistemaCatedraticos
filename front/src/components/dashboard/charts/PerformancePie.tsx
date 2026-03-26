import { PieChart as PieIcon } from "lucide-react";

export default function PerformancePie() {

  const stats = [
    { label: "Excelente", value: 31, color: "#22c55e" }, // Verde
    { label: "Muy Bueno", value: 38, color: "#3b82f6" }, // Azul
    { label: "Atención", value: 13, color: "#ef4444" },  // Rojo
    { label: "Bueno", value: 19, color: "#f59e0b" },    // Naranja
  ];


  const total = stats.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = -90; 

  return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-6 h-full shadow-2xl relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
          <PieIcon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Distribución</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Por nivel de desempeño</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-56 h-56">

          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="48" fill="#111827" stroke="#1f2937" strokeWidth="1" />
            
            {stats.map((item, index) => {
              const angle = (item.value / total) * 360;
              const startAngle = cumulativeAngle;
              cumulativeAngle += angle;

              const x1 = 50 + 48 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 48 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 48 * Math.cos((cumulativeAngle * Math.PI) / 180);
              const y2 = 50 + 48 * Math.sin((cumulativeAngle * Math.PI) / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M50,50 L${x1},${y1} A48,48 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                  fill={item.color}
                  stroke="#1e2230" 
                  strokeWidth="1"
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 font-black text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            <span className="absolute top-[20%] right-[22%]">31%</span>
            <span className="absolute top-[42%] left-[12%]">38%</span>
            <span className="absolute bottom-[28%] right-[28%]">19%</span>
            <span className="absolute top-[52%] -right-1">13%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 mt-10">
          {stats.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}