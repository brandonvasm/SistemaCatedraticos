import { Target, TrendingUp } from "lucide-react";

export default function ThresholdCard() {
  return (
    <div className="bg-gradient-to-br from-[#1e2b4a]/60 to-[#111827]/40 border border-blue-500/20 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex items-center gap-2 text-blue-400 mb-4 self-start">
        <div className="p-2 bg-blue-500/10 rounded-lg"><Target size={20} /></div>
        <h3 className="font-bold tracking-tight text-sm">Sobre 80% (≥4.0)</h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">9</span>
        <span className="text-2xl text-gray-600 font-bold ml-1">/12</span>
      </div>
      <p className="text-[10px] text-blue-300/70 font-black mt-2 uppercase tracking-[0.2em]">DOCENTES CALIFICADOS</p>
      <div className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-500/10 py-2 rounded-full border border-blue-500/20 text-[10px] text-blue-400 font-bold">
        <TrendingUp size={14} /> +12.5% VS SEMESTRE ANTERIOR
      </div>
    </div>
  );
}