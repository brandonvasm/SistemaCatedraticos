import { Zap, TrendingUp, AlertTriangle } from "lucide-react";

export default function EfficiencyPanel() {
  return (
    <div className="flex flex-col h-full space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Análisis de Eficiencia</h3>
          <p className="text-xs text-gray-400">Insights basados en carga y rendimiento</p>
        </div>
      </div>


      <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
        <div className="flex items-center gap-2 text-green-400 mb-2 font-bold text-[10px] uppercase">
          <TrendingUp size={14} /> Alto Potencial de Crecimiento
        </div>
        <div className="flex justify-between text-sm text-white">
          <span>Dra. Ana Rodríguez</span>
        </div>
        <p className="text-[11px] text-green-500/70 mt-2 italic">💡 Pueden asumir más secciones o cursos complejos</p>
      </div>

      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
        <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-[10px] uppercase">
          <AlertTriangle size={14} /> Zona de Riesgo
        </div>
        <div className="flex justify-between text-sm text-white">
          <span>Ing. Patricia López</span>
        </div>
        <p className="text-[11px] text-red-500/70 mt-2 italic"> Considerar redistribución de carga o apoyo adicional</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase">Carga Prom.</p>
          <p className="text-xl font-bold text-blue-400">164</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase">Rendimiento</p>
          <p className="text-xl font-bold text-yellow-500">4.27</p>
        </div>
      </div>
    </div>
  );
}