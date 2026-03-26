import { motion } from "framer-motion";

export default function PerformanceScatter() {
  const points = [
    { x: 120, y: 3.2, color: "bg-red-500", label: "A. Muy Cargado" },
    { x: 145, y: 4.6, color: "bg-green-500", label: "Excelente" },
    { x: 165, y: 4.8, color: "bg-green-500", label: "Top Performance" },
    { x: 180, y: 4.1, color: "bg-blue-500", label: "Balanceado" },
    { x: 205, y: 4.4, color: "bg-blue-500", label: "Alta Demanda" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 shadow-2xl h-full"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-purple-500/20">C</div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Carga vs Rendimiento</h3>
          <p className="text-sm text-gray-500">Relación estudiantes y calificación</p>
        </div>
      </div>

      <div className="relative h-[320px] w-full mt-4 flex">

        <div className="flex flex-col justify-between text-[11px] font-bold text-gray-600 pr-4 pb-8 italic">
          <span>5</span><span>2</span><span>0</span>
          <div className="absolute -left-10 top-1/2 -rotate-90 text-[9px] uppercase tracking-[0.2em]">Calificación</div>
        </div>


        <div className="relative flex-1 border-l border-b border-gray-700/50 mb-8">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.8, zIndex: 50 }}
              className={`absolute w-4 h-4 rounded-full ${p.color} border-2 border-[#1e2230] shadow-xl cursor-crosshair group`}
              style={{ left: `${(p.x / 220) * 100}%`, bottom: `${(p.y / 5) * 100}%` }}
            >

              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none uppercase">
                {p.label} <br/> <span className="text-blue-600">{p.x} Est.</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

   
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/5">
        {[
          { color: "bg-green-500", text: "≥4.5 Excelente" },
          { color: "bg-blue-500", text: "4.0-4.4 Muy Bueno" },
          { color: "bg-orange-500", text: "3.5-3.9 Bueno" },
          { color: "bg-red-500", text: "<3.5 Atención" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">{item.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}