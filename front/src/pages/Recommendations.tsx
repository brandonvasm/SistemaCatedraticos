import { useState, useEffect } from "react";
import { Loader2, Inbox, Sparkles } from "lucide-react";
import { Card } from "../components/recommendations/Card";
import { recommendationService } from "../services/recommendationService";
import { RecomendacionDetalleCard } from "../components/recommendations/RecomendacionDetalleCard";

const CATEGORIAS = [
  { id: 1, name: "Cursos" },
  { id: 2, name: "Docentes" }
];

export default function Recommendations() {
  const [categoriaId, setCategoriaId] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = categoriaId === 1 
          ? await recommendationService.getCourseRecommendations() 
          : await recommendationService.getGeneralRecommendations();
        setData(res.recommendations || []);
      } catch (e) {
        console.error("Error cargando recomendaciones:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoriaId]);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
          RECOMENDACIONES
        </h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] mt-3 ml-1">
          Generales · 3 RECOMENDACIONES
        </p>
      </header>

      <div className="flex gap-6 max-w-sm">
        {CATEGORIAS.map(cat => (
          <Card 
            key={cat.id} 
            name={cat.name} 
            isSelected={categoriaId === cat.id} 
            onClick={() => setCategoriaId(cat.id)} 
          />
        ))}
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row min-h-[580px] transition-all duration-500">
        
        <div className="w-full lg:w-[35%] border-r border-white/5 p-10 space-y-10 bg-white/[0.01]">
          <div className="flex items-center gap-3 text-yellow-400/40 font-black text-[9px] uppercase tracking-[0.4em]">
            <Sparkles size={14} />
            <span>Recomendaciones</span>
          </div>

          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-yellow-400" /></div>
          ) : data.length > 0 ? (
            <div className="space-y-8">
              {data.map((nombre, idx) => (
                <div key={idx} className="group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                  <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors cursor-default">
                    {nombre}
                  </p>
                  <div className="h-px w-8 bg-white/5 mt-6 group-hover:w-full group-hover:bg-yellow-400/30 transition-all duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
              <Inbox size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Sin recomendaciones</p>
            </div>
          )}
        </div>

        <div className="flex-1 p-12 space-y-12 bg-gradient-to-br from-transparent to-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-yellow-400/30" />
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Detalle de Recomendaciones</h2>
            </div>
            {data.length > 0 && (
                <div className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                    <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{data.length} Recomendaciones</span>
                </div>
            )}
          </div>

          <div className="space-y-6">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <RecomendacionDetalleCard 
                  key={idx}
                  tipo={categoriaId === 1 ? 'curso' : 'docente'}
                  titulo={item}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 border border-white/5 border-dashed rounded-[3rem]">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Esperando recomendaciones...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}